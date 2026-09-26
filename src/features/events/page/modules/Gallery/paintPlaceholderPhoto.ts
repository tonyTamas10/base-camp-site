import { createRng, pick } from '@/lib/random';

const GRADIENTS = [
  ['#16248A', '#050A2C'],
  ['#1C2E9E', '#121F6E'],
  ['#243B8F', '#050A2C'],
  ['#3A2A5C', '#050A2C'],
] as const;

/**
 * A soft, floodlit "photo" of figures on a pitch, used until real photos are uploaded.
 * Deterministic per seed.
 */
export function paintPlaceholderPhoto(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seed: string,
) {
  const rng = createRng(seed);
  const [top, bottom] = pick(rng, GRADIENTS);

  let gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Floodlight.
  const lightX = rng() * width;
  gradient = ctx.createRadialGradient(lightX, height * 0.1, 0, lightX, height * 0.1, width * 0.7);
  gradient.addColorStop(0, 'rgb(255 240 220 / 55%)');
  gradient.addColorStop(1, 'rgb(255 240 220 / 0%)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Field lines.
  ctx.strokeStyle = 'rgb(247 247 242 / 25%)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.72);
  ctx.lineTo(width, height * 0.62);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.8, width * 0.25, height * 0.08, -0.08, 0, Math.PI * 2);
  ctx.stroke();

  // Soft silhouettes.
  ctx.filter = 'blur(3px)';
  const figures = 5 + Math.floor(rng() * 7);
  for (let i = 0; i < figures; i++) {
    const x = rng() * width;
    const y = height * (0.45 + rng() * 0.35);
    const size = height * (0.12 + rng() * 0.2);
    ctx.fillStyle = rng() < 0.3 ? 'rgb(255 91 26 / 85%)' : 'rgb(5 10 44 / 85%)';
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.22, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgb(5 10 44 / 90%)';
    ctx.beginPath();
    ctx.arc(x, y - size * 0.62, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.filter = 'none';

  // Grain.
  const image = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0; i < image.data.length; i += 4) {
    const noise = (rng() - 0.5) * 22;
    image.data[i] = image.data[i]! + noise;
    image.data[i + 1] = image.data[i + 1]! + noise;
    image.data[i + 2] = image.data[i + 2]! + noise;
  }
  ctx.putImageData(image, 0, 0);
}
