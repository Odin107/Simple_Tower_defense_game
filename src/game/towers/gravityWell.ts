import type { Vector2 } from '@/types';
import { BaseTower, type TowerSnapshot } from './baseTower';

export interface GravityWellOptions extends TowerSnapshot {
  pulseAmplitude?: number;
  pulsePeriod?: number;
}

export class GravityWellTower extends BaseTower {
  private readonly baseMass: number;
  private readonly pulseAmplitude: number;
  private readonly pulsePeriod: number;
  private elapsed = 0;

  constructor(options: GravityWellOptions) {
    super(options);
    this.baseMass = options.mass;
    this.pulseAmplitude = options.pulseAmplitude ?? 0;
    this.pulsePeriod = options.pulsePeriod ?? 1;
  }

  tick(deltaSeconds: number): void {
    if (this.pulseAmplitude <= 0 || this.pulsePeriod <= 0) {
      return;
    }

    this.elapsed = (this.elapsed + deltaSeconds) % this.pulsePeriod;
    const oscillation = Math.sin((this.elapsed / this.pulsePeriod) * Math.PI * 2);
    this.mass = this.baseMass + this.pulseAmplitude * oscillation;
  }

  serialize(): GravityWellOptions {
    return {
      id: this.id,
      position: { ...this.position },
      mass: this.mass,
      radius: this.radius,
      falloff: this.falloff,
      maxForce: this.maxForce,
      pulseAmplitude: this.pulseAmplitude,
      pulsePeriod: this.pulsePeriod
    };
  }
}

export function createGravityWell(
  id: string,
  position: Vector2,
  mass: number,
  radius: number,
  falloff: number,
  maxForce: number,
  pulseAmplitude = 0,
  pulsePeriod = 4
): GravityWellTower {
  return new GravityWellTower({
    id,
    position,
    mass,
    radius,
    falloff,
    maxForce,
    pulseAmplitude,
    pulsePeriod
  });
}
