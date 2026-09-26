import Link from 'next/link';
import type { CSSProperties } from 'react';

import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { ScrollRegion } from '@/components/ui/ScrollRegion';
import { Tag } from '@/components/ui/Tag';
import { DEFAULT_EVENT_MODULES, EVENT_MODULE_TYPES, type EventSummary } from '@/domain/event';
import type { Sport, SportKind } from '@/domain/sport';
import { EventCard } from '@/features/deck';
import { moduleFitsKind } from '@/features/events';
import { Poster } from '@/features/posters';
import { contrastRatio, rateContrast } from '@/lib/color/contrast';
import { cx } from '@/lib/cx';
import { eventHref } from '@/lib/routes';

import {
  ACCESS_RULES,
  CONTRAST_PAIRS,
  KEY_FRAMES,
  MOTION_CURVES,
  NEW_SPORT_STEPS,
  PRINCIPLES,
  RESPONSIVE_ROWS,
  SECTIONS,
  SPACING_SCALE,
  STORY_FRAMES,
  SWATCHES,
  TYPE_SCALE,
} from './content';
import styles from './DesignSystem.module.css';
import { FilterPreview } from './FilterPreview';
import { KeyFrameSketch } from './KeyFrameSketch';
import { MotionDemo } from './MotionDemo';

export interface DesignSystemPageProps {
  /** One event per sport, to show posters and cards. */
  samples: EventSummary[];
  sports: Sport[];
  labels: { eyebrow: string; title: string; lede: string; playMotion: string; backToLoop: string };
}

const KINDS: readonly SportKind[] = ['team', 'track'];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Rules({ items }: { items: ReadonlyArray<readonly [string, string]> }) {
  return (
    <ol className={styles.rules}>
      {items.map(([title, body]) => (
        <li key={title}>
          <div>
            <b>{title}</b>
            <span>{body}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function DesignSystemPage({ samples, sports, labels }: DesignSystemPageProps) {
  const geometryOf = (slug: string) => sports.find((sport) => sport.slug === slug)?.geometry;
  const sample = samples[0];

  return (
    <>
      <PageHeader eyebrow={labels.eyebrow} title={labels.title} lede={labels.lede} />
      <div className={styles.page}>
        <nav className={styles.sectionNav} aria-label={labels.title}>
          {SECTIONS.map(([id, name]) => (
            <a key={id} href={`#${id}`}>
              {name}
            </a>
          ))}
        </nav>

        <Section id="principles" title="Principles">
          <Rules items={PRINCIPLES} />
        </Section>

        <Section id="colour" title="Colour">
          <div className={styles.swatches}>
            {SWATCHES.map(([name, hex, role, ink]) => (
              <div key={name} className={styles.swatch}>
                <div className={styles.swatchColour} style={{ background: hex, color: ink }}>
                  {name}
                </div>
                <div className={styles.swatchInfo}>
                  <code>{hex}</code>
                  <span>{role}</span>
                </div>
              </div>
            ))}
          </div>
          <h3>Contrast (computed, WCAG 2.1)</h3>
          <ul className={styles.contrast}>
            {CONTRAST_PAIRS.map(([foreground, background, name]) => {
              const ratio = contrastRatio(foreground, background);
              return (
                <li key={name}>
                  {/* Specimens are large type: the size at which every listed pair may be used. */}
                  <span className={styles.specimen} style={{ background, color: foreground }}>
                    {name}
                  </span>
                  <span className={styles.rating}>
                    {ratio.toFixed(1)}:1 · {rateContrast(ratio)}
                  </span>
                </li>
              );
            })}
          </ul>
          <p>
            Orange on blue is for shapes and indicators only. When orange carries text, it is a fill
            with midnight type on top, or deep signal for large type on paper. Event accents (amber,
            mint, rose, pale blue) live inside posters and a 3px card rule; they never replace
            signal orange for interaction.
          </p>
        </Section>

        <Section id="type" title="Typography">
          <p>
            Big Shoulders for athletic, condensed display type. Hanken Grotesk for reading. Martian
            Mono for data labels, counters and timestamps. All three cover Romanian ș ț ă â î, and
            all are self-hosted.
          </p>
          <div className={styles.typeScale}>
            {TYPE_SCALE.map(([name, size, sampleStyle, text]) => (
              <div key={name} className={styles.typeRow}>
                <code>
                  {name}
                  <br />
                  {size}
                </code>
                <span className={styles[`type-${sampleStyle}`]}>{text}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="spacing" title="Spacing & layout">
          <p>
            A 4px base. Sections breathe at 64–140px; controls sit 8–16px apart. Desktop navigation
            takes 236px on the left without a panel.
          </p>
          <ul className={styles.spacing}>
            {SPACING_SCALE.map((size) => (
              <li key={size}>
                <i style={{ '--size': `${size}px` } as CSSProperties} />
                {size}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="motion" title="Motion">
          <p>
            Acceleration, momentum, passing. Transforms and opacity only; native scroll is never
            hijacked. Every sequence can be interrupted by input.
          </p>
          <MotionDemo curves={MOTION_CURVES} label={labels.playMotion} />
          <h3>Reduced motion</h3>
          <p>
            Ambient layers render one still frame. The ribbon stops. The dial turns one year per
            input with no momentum. Deck cards cross-fade instead of moving in depth. Reveals are
            skipped, so all content shows immediately.
          </p>
        </Section>

        <Section id="states" title="Components & states">
          <h3>Buttons</h3>
          <div className={styles.states}>
            <div className={styles.state}>
              <small>Default</small>
              <Button variant="primary" withArrow tabIndex={-1}>
                Register
              </Button>
              <Button tabIndex={-1}>Secondary</Button>
            </div>
            <div className={styles.state}>
              <small>Hover</small>
              <Button variant="primary" withArrow data-demo-state="hover" tabIndex={-1}>
                Register
              </Button>
              <Button data-demo-state="hover" tabIndex={-1}>
                Secondary
              </Button>
            </div>
            <div className={styles.state}>
              <small>Focus</small>
              <Button variant="primary" withArrow data-demo-state="focus" tabIndex={-1}>
                Register
              </Button>
            </div>
            <div className={styles.state}>
              <small>Loading</small>
              <Button variant="primary" isLoading tabIndex={-1}>
                Register
              </Button>
            </div>
            <div className={styles.state}>
              <small>Disabled</small>
              <Button variant="primary" disabled>
                Register
              </Button>
            </div>
          </div>

          <h3>Loop dial</h3>
          <div className={styles.states}>
            <div className={styles.state}>
              <small>Default · selected</small>
              <div className={styles.dialYears}>
                <span>2023</span>
                <span>2024</span>
                <span className={styles.dialSelected}>2025</span>
              </div>
            </div>
            <div className={styles.state}>
              <small>Empty year</small>
              <div className={styles.dialYears}>
                <span className={styles.dialEmpty}>2020</span>
              </div>
              <span className={styles.note}>0 events · dimmed, still selectable</span>
            </div>
            <div className={styles.state}>
              <small>Focus mode</small>
              <span className={styles.note}>
                Hovering, dragging or keyboard-focusing the dial fades everything else to 35% while
                the labels, counts and tick ring brighten. No overlay, no glow.
              </span>
            </div>
            <div className={styles.state}>
              <small>Loop seam</small>
              <span className={styles.note}>2026 ┊ ↺ ┊ 2017</span>
              <span className={styles.note}>
                The dashed seam keeps chronology legible while the axis wraps.
              </span>
            </div>
          </div>

          <h3>Filters and tags</h3>
          <div className={styles.states}>
            <div className={styles.state}>
              <small>Segmented control</small>
              <FilterPreview />
            </div>
            <div className={styles.state}>
              <small>Status tags</small>
              <Tag tone="signal">Upcoming</Tag>
              <Tag tone="inverted">This week</Tag>
              <Tag>Past</Tag>
            </div>
          </div>

          {sample && (
            <>
              <h3>Deck card</h3>
              <div className={styles.states}>
                <div className={styles.state}>
                  <small>Front / active</small>
                  <EventCard
                    event={sample}
                    geometry={geometryOf(sample.sportSlug)}
                    className={styles.demoCard}
                    aria-hidden
                  />
                </div>
                <div className={styles.state}>
                  <small>Behind (depth 1–3)</small>
                  <EventCard
                    event={sample}
                    geometry={geometryOf(sample.sportSlug)}
                    className={cx(styles.demoCard, styles.demoBehind)}
                    aria-hidden
                  />
                </div>
                <div className={styles.state}>
                  <small>Empty</small>
                  <div className={styles.demoEmpty}>
                    No events in 2020
                    <br />→ nearest year
                  </div>
                </div>
              </div>
            </>
          )}
        </Section>

        <Section id="responsive" title="Responsive">
          <ScrollRegion label="Responsive behaviour">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">Desktop and tablet ≥ 900</th>
                  <th scope="col">Phone &lt; 900</th>
                </tr>
              </thead>
              <tbody>
                {RESPONSIVE_ROWS.map(([component, desktop, phone]) => (
                  <tr key={component}>
                    <th scope="row">{component}</th>
                    <td>{desktop}</td>
                    <td>{phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollRegion>
        </Section>

        <Section id="imagery" title="Imagery & posters">
          <p>
            Each sport owns one geometry drawn from its field: pitch markings for football, a
            compact box for minifootball, curved lanes for athletics, straight lanes and a finish
            line for sprints. Posters combine that geometry, one accent shape, the event name and an
            outlined year. Photos reveal through a track-shaped mask.
          </p>
          <ul className={styles.posters}>
            {samples.map((event) => (
              <li key={event.id}>
                <Link href={eventHref(event)} aria-label={`${event.name} ${event.year}`}>
                  <Poster event={event} geometry={geometryOf(event.sportSlug)} />
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="modules" title="Event modules">
          <p>
            Shared foundations are always present: identity and poster, metadata, navigation, the
            Loop rail, and the next action. Everything else is a module that editors can add, remove
            and reorder. This matrix is generated from the code, so it is always current.
          </p>
          <ScrollRegion label="Event modules">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Module</th>
                  {KINDS.map((kind) => (
                    <th key={kind} scope="col">
                      {kind} sports
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EVENT_MODULE_TYPES.map((type) => (
                  <tr key={type}>
                    <th scope="row">{type}</th>
                    {KINDS.map((kind) => {
                      const isDefault = DEFAULT_EVENT_MODULES[kind].includes(type);
                      const fits = moduleFitsKind(type, kind);
                      return (
                        <td key={kind} className={styles.center}>
                          {isDefault ? (
                            <span className={styles.dot} aria-label="default" role="img" />
                          ) : fits ? (
                            <span
                              className={cx(styles.dot, styles.dotOptional)}
                              aria-label="optional"
                              role="img"
                            />
                          ) : (
                            <span aria-label="not available">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollRegion>
          <p className={styles.note}>
            <span className={styles.dot} /> default &nbsp;{' '}
            <span className={cx(styles.dot, styles.dotOptional)} /> optional &nbsp; — not available
            for that kind of competition
          </p>
        </Section>

        <Section id="new-sport" title="Adding a sport">
          <Rules items={NEW_SPORT_STEPS} />
        </Section>

        <Section id="key-frames" title="Key frames">
          <h3>Home → Events (≈ 720ms, interruptible)</h3>
          <ol className={styles.frames}>
            {KEY_FRAMES.map((text, step) => (
              <li key={text}>
                <div className={styles.frameScreen}>
                  <KeyFrameSketch step={step} />
                </div>
                <p>
                  <b>{String(step + 1).padStart(2, '0')}</b>
                  {text}
                </p>
              </li>
            ))}
          </ol>
          <h3>Event story, while scrolling</h3>
          <ol className={styles.frames}>
            {STORY_FRAMES.map(([name, text], i) => (
              <li key={name}>
                <p>
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  {name}. {text}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="access" title="Access & performance">
          <Rules items={ACCESS_RULES} />
        </Section>
      </div>
      <footer className={styles.footer}>
        <span>Base Camp design system</span>
        <Link href="/">{labels.backToLoop}</Link>
      </footer>
    </>
  );
}
