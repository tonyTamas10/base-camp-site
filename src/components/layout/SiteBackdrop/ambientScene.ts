/*
 * The ambient scene: a running track drifting behind the site, two runners looping their lanes,
 * and (on wide screens) a faint tactical diagram. Pure drawing, driven by elapsed time.
 */

const WIDE_BREAKPOINT = 900;

/** Traces a stadium shape (two straights joined by semicircles) centred on the origin. */
function traceStadium(ctx: CanvasRenderingContext2D, halfStraight: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(-halfStraight, -radius);
  ctx.lineTo(halfStraight, -radius);
  ctx.arc(halfStraight, 0, radius, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(-halfStraight, radius);
  ctx.arc(-halfStraight, 0, radius, Math.PI / 2, Math.PI * 1.5);
  ctx.closePath();
}

/** Lane index, speed, colour and trail length of each runner. */
const RUNNERS = [
  { lane: 1, speed: 0.9, color: 'rgb(255 91 26 / 85%)', length: 60 },
  { lane: 4, speed: 0.7, color: 'rgb(247 247 242 / 60%)', length: 40 },
] as const;

export function drawAmbientScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seconds: number,
) {
  const compact = width < WIDE_BREAKPOINT;
  ctx.clearRect(0, 0, width, height);

  const lanes = compact ? 5 : 8;
  const innerRadius = Math.min(width, height) * (compact ? 0.34 : 0.3);
  const halfStraight = innerRadius * 0.95;
  const laneWidth = compact ? 11 : 14;

  ctx.save();
  ctx.translate(width * (compact ? 0.8 : 0.7), height * 0.52);
  ctx.rotate(-0.32 + Math.sin(seconds * 0.05) * 0.03);

  for (let lane = 0; lane < lanes; lane++) {
    const isEdge = lane === 0 || lane === lanes - 1;
    traceStadium(ctx, halfStraight, innerRadius + lane * laneWidth);
    ctx.strokeStyle = `rgb(247 247 242 / ${isEdge ? 20 : 9}%)`;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.stroke();
  }

  for (const runner of RUNNERS) {
    if (runner.lane >= lanes) continue;
    const radius = innerRadius + runner.lane * laneWidth + laneWidth / 2;
    const perimeter = 4 * halfStraight + 2 * Math.PI * radius;
    traceStadium(ctx, halfStraight, radius);
    ctx.setLineDash([runner.length, perimeter]);
    ctx.lineDashOffset = -(seconds * runner.speed * 90) % perimeter;
    ctx.strokeStyle = runner.color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }
  ctx.restore();
  ctx.setLineDash([]);

  if (!compact) drawTacticalDiagram(ctx, width, height, seconds);
}

function drawTacticalDiagram(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seconds: number,
) {
  ctx.save();
  ctx.translate(
    width * 0.34 + Math.sin(seconds * 0.07) * 10,
    height * 0.3 + Math.cos(seconds * 0.05) * 8,
  );
  ctx.strokeStyle = 'rgb(195 207 255 / 22%)';
  ctx.lineWidth = 1.2;

  ctx.setLineDash([3, 6]);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(80, -60, 180, -40, 240, 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(40, 120);
  ctx.quadraticCurveTo(160, 150, 220, 80);
  ctx.stroke();
  ctx.setLineDash([]);

  for (const [x, y] of [
    [0, 0],
    [40, 120],
  ] as const) {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (const [x, y] of [
    [240, 20],
    [220, 80],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 5);
    ctx.lineTo(x + 5, y + 5);
    ctx.moveTo(x + 5, y - 5);
    ctx.lineTo(x - 5, y + 5);
    ctx.stroke();
  }
  ctx.restore();
}
