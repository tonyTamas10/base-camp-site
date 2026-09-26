/*
 * Runs the Loop dial: animation loop, input, labels and accessibility state. Deliberately outside
 * React: the dial redraws every frame while moving, and routing that through React state would
 * re-render the component tree 60 times a second. React creates one controller and feeds it data.
 */
import {
  angleOfPointer,
  arcLength,
  deriveDialFrame,
  labelOpacity,
  pointAt,
  visibleHalfAngle,
  LABEL_SPACE,
  type DialFrame,
  type DialTarget,
} from './dialGeometry';
import {
  advance,
  applyWheel,
  clampVelocity,
  createMotion,
  nearestIndexOf,
  restingIndex,
  yearAt,
  FRAME_MS,
  type DialMotion,
} from './dialPhysics';
import { paintDial } from './paintDial';

export interface DialElements {
  /** The focusable slider element. */
  slider: HTMLElement;
  band: HTMLElement;
  canvas: HTMLCanvasElement;
  labels: HTMLElement;
  hitArea: HTMLElement;
}

export interface DialClassNames {
  label: string;
  year: string;
  count: string;
  empty: string;
  selected: string;
  dragging: string;
}

export interface DialCallbacks {
  /** The dial came to rest on a year. */
  onSettle: (year: number) => void;
  /** The year under the pointer changed while moving (for live accessibility values). */
  onSelectionChange: (year: number) => void;
  /** Enter, Space, or a tap on the selected year. */
  onActivate: () => void;
  /** Hover, drag or keyboard focus started or ended. */
  onFocusModeChange: (active: boolean) => void;
}

const LABEL_POOL_SIZE = 16;
const LABEL_OFFSET = 30;
const GEOMETRY_EASE_PER_FRAME = 0.14;
const GEOMETRY_REST = 0.3;
const MAX_FRAME_MS = 48;
/** Pointer movement along the arc (px) before a press becomes a drag. */
const DRAG_THRESHOLD = 5;
const REDUCED_MOTION_WHEEL_COOLDOWN_MS = 260;
const TOUCH_FOCUS_LINGER_MS = 700;
/** A release this long after the last move is a stop, not a flick. */
const FLICK_WINDOW_MS = 90;
const MAX_PIXEL_RATIO = 2;

interface LabelSlot {
  element: HTMLElement;
  year: HTMLElement;
  count: HTMLElement;
  index: number | null;
  version: number;
  selected: boolean | null;
  opacity: number;
}

interface DragState {
  pointerId: number;
  startAngle: number;
  startPosition: number;
  lastAngle: number;
  lastTime: number;
  velocity: number;
  moved: boolean;
}

export class DialController {
  private years: number[] = [];
  private counts: number[] = [];
  private formatCount: (count: number) => string = String;
  private labelsVersion = 0;

  private motion: DialMotion;
  private current: DialTarget;
  private goal: DialTarget;
  private frame: DialFrame;
  private frameKey = '';
  private pixelRatio = 1;

  private animationFrame = 0;
  private lastTime = 0;
  private drag: DragState | null = null;
  private selectedIndex: number;
  private settledIndex: number | null = null;
  private focusModeActive = false;
  private focusTimer = 0;
  private lastWheelStep = 0;
  private reducedMotion = false;
  private readonly slots: LabelSlot[] = [];
  private readonly context: CanvasRenderingContext2D;
  private readonly cleanup: Array<() => void> = [];

  constructor(
    private readonly elements: DialElements,
    private readonly classNames: DialClassNames,
    private readonly callbacks: DialCallbacks,
    initial: { target: DialTarget; index: number },
  ) {
    const context = elements.canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D is not available');
    this.context = context;
    this.motion = createMotion(initial.index);
    this.selectedIndex = initial.index;
    this.current = { ...initial.target };
    this.goal = { ...initial.target };
    this.frame = deriveDialFrame(this.current, window.innerWidth);
    this.createLabelPool();
    this.bindInput();
  }

  /* ---------- data ---------- */

  setData(years: number[], counts: number[], formatCount: (count: number) => string) {
    this.years = years;
    this.counts = counts;
    this.formatCount = formatCount;
    this.labelsVersion++;
    this.render();
  }

  setReducedMotion(reduced: boolean) {
    this.reducedMotion = reduced;
  }

  /** Animates the dial's shape (e.g. between home and events), or jumps when `instant`. */
  setTarget(target: DialTarget, instant = false) {
    this.goal = { ...target };
    if (instant || this.reducedMotion) {
      this.current = { ...target };
      this.render();
      return;
    }
    this.run();
  }

  get year(): number {
    return yearAt(this.years, restingIndex(this.motion));
  }

  /* ---------- movement ---------- */

  goToIndex(index: number, instant = false) {
    this.motion.velocity = 0;
    if (instant || this.reducedMotion) {
      this.motion.position = index;
      this.motion.target = null;
      this.render();
      this.settle();
      return;
    }
    this.motion.target = index;
    this.run();
  }

  goToYear(year: number, instant = false) {
    const index = nearestIndexOf(this.years, year, restingIndex(this.motion));
    if (index !== null) this.goToIndex(index, instant);
  }

  step(direction: number) {
    this.goToIndex(restingIndex(this.motion) + direction);
  }

  /** Spins in from an offset, as when arriving on the events hub. */
  glide(offset: number) {
    if (this.reducedMotion) return;
    const index = restingIndex(this.motion);
    this.motion.position = index - offset;
    this.motion.velocity = 0;
    this.motion.target = index;
    this.run();
  }

  /** The closest year (by index) that has events, searching outwards. */
  nearestYearWithEvents(): number | null {
    const from = restingIndex(this.motion);
    for (let distance = 1; distance < this.years.length; distance++) {
      for (const direction of [-1, 1]) {
        const index = from + direction * distance;
        if (this.countAt(index) > 0) return yearAt(this.years, index);
      }
    }
    return null;
  }

  /* ---------- lifecycle ---------- */

  destroy() {
    cancelAnimationFrame(this.animationFrame);
    window.clearTimeout(this.focusTimer);
    this.cleanup.forEach((fn) => fn());
    this.elements.labels.replaceChildren();
    this.setFocusMode(false);
  }

  /* ---------- animation loop ---------- */

  private run() {
    if (this.animationFrame) return;
    this.lastTime = 0;
    this.animationFrame = requestAnimationFrame(this.tick);
  }

  private readonly tick = (time: number) => {
    const elapsed = Math.min(MAX_FRAME_MS, time - (this.lastTime || time));
    this.lastTime = time;
    const frames = elapsed / FRAME_MS;

    let moving = this.tweenGeometry(frames);
    if (!this.drag && advance(this.motion, frames)) moving = true;

    this.render();

    if (moving || this.drag) {
      this.animationFrame = requestAnimationFrame(this.tick);
    } else {
      this.animationFrame = 0;
      this.settle();
    }
  };

  private tweenGeometry(frames: number): boolean {
    let moving = false;
    for (const key of Object.keys(this.goal) as Array<keyof DialTarget>) {
      const delta = this.goal[key] - this.current[key];
      if (Math.abs(delta) > GEOMETRY_REST) {
        this.current[key] += delta * Math.min(1, GEOMETRY_EASE_PER_FRAME * frames);
        moving = true;
      } else {
        this.current[key] = this.goal[key];
      }
    }
    return moving;
  }

  private settle() {
    const index = Math.round(this.motion.position);
    if (this.settledIndex === index) return;
    this.settledIndex = index;
    this.callbacks.onSettle(yearAt(this.years, index));
  }

  /* ---------- rendering ---------- */

  private render() {
    if (this.years.length === 0) return;
    this.updateFrame();
    paintDial(this.context, this.frame, this.pixelRatio, {
      position: this.motion.position,
      counts: this.counts,
      focused: this.focusModeActive,
    });
    this.renderLabels();

    const selected = Math.round(this.motion.position);
    if (selected !== this.selectedIndex) {
      this.selectedIndex = selected;
      this.callbacks.onSelectionChange(yearAt(this.years, selected));
    }
  }

  private updateFrame() {
    this.frame = deriveDialFrame(this.current, window.innerWidth);
    const { band, radius, center } = this.frame;
    const key = [band.left, band.width, band.height, band.top, radius]
      .map((n) => n.toFixed(1))
      .join('|');
    if (key === this.frameKey) return;
    this.frameKey = key;

    const { band: bandElement, canvas, hitArea } = this.elements;
    bandElement.style.width = `${band.width}px`;
    bandElement.style.height = `${band.height.toFixed(1)}px`;
    bandElement.style.transform = `translate3d(${band.left}px, ${band.top.toFixed(1)}px, 0)`;

    this.pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    const width = Math.round(band.width * this.pixelRatio);
    const height = Math.round(band.height * this.pixelRatio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    // Only the visible disc is interactive, not the corners of the band.
    hitArea.style.clipPath = `circle(${(radius + LABEL_SPACE).toFixed(1)}px at ${center.x.toFixed(1)}px ${center.y.toFixed(1)}px)`;
  }

  private createLabelPool() {
    const { label, year, count } = this.classNames;
    for (let i = 0; i < LABEL_POOL_SIZE; i++) {
      const element = document.createElement('div');
      element.className = label;
      const yearElement = document.createElement('b');
      yearElement.className = year;
      const countElement = document.createElement('span');
      countElement.className = count;
      element.append(yearElement, countElement);
      this.elements.labels.append(element);
      this.slots.push({
        element,
        year: yearElement,
        count: countElement,
        index: null,
        version: -1,
        selected: null,
        opacity: -1,
      });
    }
  }

  private renderLabels() {
    const { frame, current, motion } = this;
    const halfAngle = visibleHalfAngle(frame, current.halfChord + 120);
    const span = Math.ceil(halfAngle / frame.degreesPerYear) + 1;
    const selected = Math.round(motion.position);
    let used = 0;

    for (
      let index = Math.floor(motion.position) - span;
      index <= Math.ceil(motion.position) + span && used < this.slots.length;
      index++
    ) {
      const angle = (index - motion.position) * frame.degreesPerYear;
      if (Math.abs(angle) > halfAngle) continue;
      const slot = this.slots[used++]!;
      const [x, y] = pointAt(frame, angle, frame.radius + LABEL_OFFSET);
      slot.element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%)`;

      const opacity = labelOpacity(frame, current, angle);
      if (Math.abs(opacity - slot.opacity) > 0.01) {
        slot.element.style.opacity = opacity.toFixed(2);
        slot.opacity = opacity;
      }

      if (slot.index !== index || slot.version !== this.labelsVersion) {
        const count = this.countAt(index);
        slot.index = index;
        slot.version = this.labelsVersion;
        slot.year.textContent = String(yearAt(this.years, index));
        slot.count.textContent = this.formatCount(count);
        slot.element.classList.toggle(this.classNames.empty, count === 0);
      }

      const isSelected = index === selected;
      if (slot.selected !== isSelected) {
        slot.element.classList.toggle(this.classNames.selected, isSelected);
        slot.selected = isSelected;
      }
    }

    for (; used < this.slots.length; used++) {
      const slot = this.slots[used]!;
      if (slot.opacity !== 0) {
        slot.element.style.opacity = '0';
        slot.opacity = 0;
      }
    }
  }

  private countAt(index: number): number {
    return this.counts.length ? yearAt(this.counts, index) : 0;
  }

  /* ---------- focus mode: the rest of the page recedes while the dial is in use ---------- */

  private setFocusMode(active: boolean) {
    window.clearTimeout(this.focusTimer);
    if (this.focusModeActive === active) return;
    this.focusModeActive = active;
    this.callbacks.onFocusModeChange(active);
    if (!this.animationFrame) this.render();
  }

  /* ---------- input ---------- */

  private listen<K extends keyof HTMLElementEventMap>(
    target: HTMLElement,
    type: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions,
  ) {
    target.addEventListener(type, handler, options);
    this.cleanup.push(() => target.removeEventListener(type, handler, options));
  }

  private bindInput() {
    const { slider, hitArea } = this.elements;

    this.listen(hitArea, 'pointerenter', (event) => {
      if (event.pointerType === 'mouse') this.setFocusMode(true);
    });
    this.listen(hitArea, 'pointerleave', () => {
      if (!this.drag && !slider.matches(':focus-visible')) this.setFocusMode(false);
    });
    this.listen(slider, 'focus', () => {
      if (slider.matches(':focus-visible')) this.setFocusMode(true);
    });
    this.listen(slider, 'blur', () => this.setFocusMode(false));

    this.listen(hitArea, 'wheel', this.onWheel, { passive: false });
    this.listen(hitArea, 'pointerdown', this.onPointerDown);
    this.listen(hitArea, 'pointermove', this.onPointerMove);
    this.listen(hitArea, 'pointerup', this.onPointerEnd);
    this.listen(hitArea, 'pointercancel', this.onPointerEnd);
    this.listen(slider, 'keydown', this.onKeyDown);
  }

  private readonly onWheel = (event: WheelEvent) => {
    event.preventDefault();
    let delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 30;

    if (this.reducedMotion) {
      const now = performance.now();
      if (now - this.lastWheelStep < REDUCED_MOTION_WHEEL_COOLDOWN_MS) return;
      this.lastWheelStep = now;
      this.step(Math.sign(delta));
      return;
    }
    applyWheel(this.motion, delta);
    this.run();
  };

  private readonly onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const angle = angleOfPointer(this.frame, event.clientX, event.clientY);
    this.drag = {
      pointerId: event.pointerId,
      startAngle: angle,
      startPosition: this.motion.position,
      lastAngle: angle,
      lastTime: performance.now(),
      velocity: 0,
      moved: false,
    };
    this.motion.target = null;
    this.motion.velocity = 0;
    this.elements.hitArea.setPointerCapture(event.pointerId);
    this.setFocusMode(true);
    this.run();
  };

  private readonly onPointerMove = (event: PointerEvent) => {
    const drag = this.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const angle = angleOfPointer(this.frame, event.clientX, event.clientY);

    if (!drag.moved && arcLength(this.frame, angle - drag.startAngle) > DRAG_THRESHOLD) {
      drag.moved = true;
      this.elements.hitArea.classList.add(this.classNames.dragging);
    }
    if (!drag.moved) return;

    // Horizontal movement maps 1:1 onto arc length.
    const perYear = this.frame.degreesPerYear;
    this.motion.position = drag.startPosition - (angle - drag.startAngle) / perYear;
    const now = performance.now();
    const elapsed = Math.max(8, now - drag.lastTime);
    const instantVelocity = (-(angle - drag.lastAngle) / perYear) * (FRAME_MS / elapsed);
    drag.velocity = 0.6 * drag.velocity + 0.4 * instantVelocity;
    drag.lastAngle = angle;
    drag.lastTime = now;
  };

  private readonly onPointerEnd = (event: PointerEvent) => {
    const drag = this.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    this.drag = null;
    this.elements.hitArea.classList.remove(this.classNames.dragging);
    if (event.pointerType !== 'mouse') {
      this.focusTimer = window.setTimeout(() => this.setFocusMode(false), TOUCH_FOCUS_LINGER_MS);
    }

    if (!drag.moved) {
      // A tap: activate the selected year, or turn to the tapped one.
      const angle = angleOfPointer(this.frame, event.clientX, event.clientY);
      const tapped = Math.round(this.motion.position + angle / this.frame.degreesPerYear);
      if (tapped === Math.round(this.motion.position)) this.callbacks.onActivate();
      else this.goToIndex(tapped);
      this.run();
      return;
    }

    const isFlick = performance.now() - drag.lastTime <= FLICK_WINDOW_MS;
    this.motion.velocity = this.reducedMotion || !isFlick ? 0 : clampVelocity(drag.velocity);
    if (this.reducedMotion) this.motion.target = Math.round(this.motion.position);
    this.run();
  };

  private readonly onKeyDown = (event: KeyboardEvent) => {
    const index = restingIndex(this.motion);
    const cycle = this.years.length;
    const cycleStart = index - (((index % cycle) + cycle) % cycle);
    const actions: Record<string, () => void> = {
      ArrowRight: () => this.step(1),
      ArrowUp: () => this.step(1),
      ArrowLeft: () => this.step(-1),
      ArrowDown: () => this.step(-1),
      Home: () => this.goToIndex(cycleStart),
      End: () => this.goToIndex(cycleStart + cycle - 1),
      Enter: () => this.callbacks.onActivate(),
      ' ': () => this.callbacks.onActivate(),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };
}
