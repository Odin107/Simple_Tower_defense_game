import type { Vector2 } from '@/types';
import { add, clampMagnitude, multiplyScalar } from '@/types';
import type { PotentialField } from '@/game/world/potentialField';

export interface CreepConfig {
  id: string;
  position: Vector2;
  speed: number;
  mass: number;
  color?: string;
  preferredDirection?: Vector2;
}

const DEFAULT_DIRECTION: Vector2 = { x: 1, y: 0 };

export class Creep {
  readonly id: string;
  position: Vector2;
  private velocity: Vector2 = { x: 0, y: 0 };
  private readonly speed: number;
  private readonly mass: number;
  private readonly color: string;
  private readonly preferredDirection: Vector2;

  constructor({ id, position, speed, mass, color, preferredDirection }: CreepConfig) {
    this.id = id;
    this.position = { ...position };
    this.speed = speed;
    this.mass = mass;
    this.color = color ?? '#f7f4d6';
    this.preferredDirection = preferredDirection ?? DEFAULT_DIRECTION;
  }

  update(field: PotentialField, deltaSeconds: number): void {
    const gradient = field.gradient(this.position);
    const gravitationalInfluence = {
      x: -gradient.x * this.mass,
      y: -gradient.y * this.mass
    };

    const desired = add(
      multiplyScalar(this.preferredDirection, this.speed),
      gravitationalInfluence
    );
    this.velocity = clampMagnitude(desired, this.speed * 2);
    this.position = add(this.position, multiplyScalar(this.velocity, deltaSeconds));
    this.position.x = Math.min(Math.max(this.position.x, 0), field.size.x);
    this.position.y = Math.min(Math.max(this.position.y, 0), field.size.y);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.position.x, this.position.y, 6, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}
