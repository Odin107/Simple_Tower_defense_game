import type { Vector2 } from '@/types';

export const WORLD_SIZE: Vector2 = { x: 960, y: 540 };
export const FIELD_RESOLUTION = 24;
export const MASS_CAPACITY = 120;
export const BASELINE_PHI = -1.2;
export const THERMOSTAT_OSCILLATION = {
  amplitude: 0.4,
  speed: 0.25
};

export interface TowerDefinition {
  position: Vector2;
  mass: number;
  radius: number;
  falloff: number;
  maxForce: number;
  pulse?: number;
  period?: number;
}

export const DEMO_TOWERS: TowerDefinition[] = [
  { position: { x: 320, y: 300 }, mass: 18, radius: 140, falloff: 2.4, maxForce: 190, pulse: 4, period: 6 },
  { position: { x: 540, y: 200 }, mass: 12, radius: 110, falloff: 2, maxForce: 160 },
  { position: { x: 680, y: 360 }, mass: 16, radius: 130, falloff: 2.2, maxForce: 180, pulse: 2, period: 4 }
];

export const DEMO_CREEP_ROWS = 8;
export const DEMO_CREEP_SPACING = 40;
export const DEMO_CREEP_OFFSET_Y = 120;
export const DEMO_CREEP_SPEED = 50;
export const DEMO_CREEP_MASS = 0.6;
