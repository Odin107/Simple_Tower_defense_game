import type { Vector2 } from '@/types';

export interface TowerSnapshot {
  id: string;
  position: Vector2;
  mass: number;
  radius: number;
  falloff: number;
  maxForce: number;
}

export abstract class BaseTower {
  readonly id: string;
  readonly position: Vector2;
  protected _mass: number;
  readonly radius: number;
  readonly falloff: number;
  readonly maxForce: number;

  protected constructor({ id, position, mass, radius, falloff, maxForce }: TowerSnapshot) {
    this.id = id;
    this.position = position;
    this._mass = mass;
    this.radius = radius;
    this.falloff = falloff;
    this.maxForce = maxForce;
  }

  get mass(): number {
    return this._mass;
  }

  protected set mass(value: number) {
    this._mass = value;
  }

  potentialAt(point: Vector2): number {
    const dx = point.x - this.position.x;
    const dy = point.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const normalized = distance / this.radius;
    const falloffFactor = Math.pow(normalized + 1e-6, this.falloff);
    return -this.mass / (1 + falloffFactor);
  }

  forceAt(point: Vector2): Vector2 {
    const dx = point.x - this.position.x;
    const dy = point.y - this.position.y;
    const distanceSq = dx * dx + dy * dy + 1e-6;
    const distance = Math.sqrt(distanceSq);
    if (distance < 1e-5) {
      return { x: 0, y: 0 };
    }

    const normalized = distance / this.radius;
    const falloffFactor = Math.pow(normalized + 1e-6, this.falloff);
    const gradientMagnitude =
      (this.mass * this.falloff * Math.pow(normalized, Math.max(this.falloff - 1, 0))) /
      (this.radius * Math.pow(1 + falloffFactor, 2));

    const magnitude = Math.min(gradientMagnitude, this.maxForce);
    const pullX = (-dx / distance) * magnitude;
    const pullY = (-dy / distance) * magnitude;
    return { x: pullX, y: pullY };
  }

  abstract tick(deltaSeconds: number): void;
}
