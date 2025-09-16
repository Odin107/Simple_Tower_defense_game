import type { Vector2 } from '@/types';
import type { BaseTower } from '@/game/towers/baseTower';

const EPSILON = 1e-4;

export interface PotentialFieldConfig {
  width: number;
  height: number;
  resolution: number;
  baseline: number;
}

export class PotentialField {
  private readonly columns: number;
  private readonly rows: number;
  private readonly grid: Float32Array;
  private minPotential = 0;
  private maxPotential = 0;
  private baseline: number;

  constructor(private readonly config: PotentialFieldConfig) {
    this.columns = Math.ceil(config.width / config.resolution) + 1;
    this.rows = Math.ceil(config.height / config.resolution) + 1;
    this.grid = new Float32Array(this.columns * this.rows);
    this.baseline = config.baseline;
  }

  get size(): Vector2 {
    return { x: this.config.width, y: this.config.height };
  }

  setBaseline(value: number): void {
    this.baseline = value;
  }

  rebuild(towers: readonly BaseTower[]): void {
    this.minPotential = Number.POSITIVE_INFINITY;
    this.maxPotential = Number.NEGATIVE_INFINITY;

    for (let row = 0; row < this.rows; row += 1) {
      for (let col = 0; col < this.columns; col += 1) {
        const x = (col / (this.columns - 1)) * this.config.width;
        const y = (row / (this.rows - 1)) * this.config.height;
        const samplePoint = { x, y } satisfies Vector2;
        let total = this.baseline;
        for (const tower of towers) {
          total += tower.potentialAt(samplePoint);
        }
        const index = row * this.columns + col;
        this.grid[index] = total;
        this.minPotential = Math.min(this.minPotential, total);
        this.maxPotential = Math.max(this.maxPotential, total);
      }
    }

    if (!Number.isFinite(this.minPotential)) {
      this.minPotential = this.baseline;
      this.maxPotential = this.baseline;
    }
  }

  samplePotential(point: Vector2): number {
    const gx = (point.x / this.config.width) * (this.columns - 1);
    const gy = (point.y / this.config.height) * (this.rows - 1);
    const x0 = Math.max(Math.floor(gx), 0);
    const y0 = Math.max(Math.floor(gy), 0);
    const x1 = Math.min(x0 + 1, this.columns - 1);
    const y1 = Math.min(y0 + 1, this.rows - 1);
    const sx = gx - x0;
    const sy = gy - y0;

    const i00 = y0 * this.columns + x0;
    const i10 = y0 * this.columns + x1;
    const i01 = y1 * this.columns + x0;
    const i11 = y1 * this.columns + x1;

    const top = this.grid[i00] * (1 - sx) + this.grid[i10] * sx;
    const bottom = this.grid[i01] * (1 - sx) + this.grid[i11] * sx;
    return top * (1 - sy) + bottom * sy;
  }

  gradient(point: Vector2): Vector2 {
    const offset = this.config.resolution;
    const left = this.samplePotential({ x: Math.max(point.x - offset, 0), y: point.y });
    const right = this.samplePotential({ x: Math.min(point.x + offset, this.config.width), y: point.y });
    const up = this.samplePotential({ x: point.x, y: Math.max(point.y - offset, 0) });
    const down = this.samplePotential({ x: point.x, y: Math.min(point.y + offset, this.config.height) });

    const dx = (right - left) / Math.max(offset * 2, EPSILON);
    const dy = (down - up) / Math.max(offset * 2, EPSILON);
    return { x: dx, y: dy };
  }

  draw(context: CanvasRenderingContext2D, dimensions: Vector2): void {
    const imageData = context.createImageData(this.columns, this.rows);
    const range = Math.max(this.maxPotential - this.minPotential, EPSILON);

    for (let row = 0; row < this.rows; row += 1) {
      for (let col = 0; col < this.columns; col += 1) {
        const index = row * this.columns + col;
        const normalized = (this.grid[index] - this.minPotential) / range;
        const color = heatMap(normalized);
        const pixelIndex = index * 4;
        imageData.data[pixelIndex] = color.r;
        imageData.data[pixelIndex + 1] = color.g;
        imageData.data[pixelIndex + 2] = color.b;
        imageData.data[pixelIndex + 3] = 200;
      }
    }

    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = this.columns;
    patternCanvas.height = this.rows;
    const patternContext = patternCanvas.getContext('2d');
    if (!patternContext) {
      return;
    }
    patternContext.putImageData(imageData, 0, 0);

    context.save();
    context.globalCompositeOperation = 'source-over';
    context.imageSmoothingEnabled = true;
    context.drawImage(patternCanvas, 0, 0, dimensions.x, dimensions.y);
    context.restore();
  }
}

function heatMap(value: number): { r: number; g: number; b: number } {
  const clamped = Math.min(Math.max(value, 0), 1);
  const r = Math.floor(255 * Math.pow(clamped, 1.5));
  const g = Math.floor(255 * (1 - Math.abs(clamped - 0.5) * 2));
  const b = Math.floor(255 * Math.pow(1 - clamped, 1.5));
  return { r, g, b };
}
