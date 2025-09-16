import { describe, expect, it } from 'vitest';
import { PotentialField } from './potentialField';
import { createGravityWell } from '@/game/towers/gravityWell';

const CONFIG = {
  width: 200,
  height: 200,
  resolution: 20,
  baseline: -1
};

describe('PotentialField', () => {
  it('returns baseline when no towers are present', () => {
    const field = new PotentialField(CONFIG);
    field.rebuild([]);
    const sample = field.samplePotential({ x: 100, y: 100 });
    expect(sample).toBeCloseTo(CONFIG.baseline, 5);
  });

  it('produces a stronger potential near a gravity well', () => {
    const field = new PotentialField(CONFIG);
    const tower = createGravityWell(
      'test-tower',
      { x: 100, y: 100 },
      10,
      60,
      2,
      80
    );

    field.rebuild([tower]);
    const center = field.samplePotential({ x: 100, y: 100 });
    const edge = field.samplePotential({ x: 180, y: 100 });
    expect(center).toBeLessThan(edge);
  });
});
