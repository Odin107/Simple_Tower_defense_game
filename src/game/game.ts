import { CanvasManager } from '@/engine/canvas';
import { GameLoop } from '@/engine/gameLoop';
import { PotentialField } from '@/game/world/potentialField';
import { createGravityWell, type GravityWellTower } from '@/game/towers/gravityWell';
import { Creep } from '@/game/creeps/creep';
import { MassManager } from '@/game/systems/massManager';
import { HudOverlay } from '@/game/ui/hud';
import {
  BASELINE_PHI,
  DEMO_CREEP_MASS,
  DEMO_CREEP_OFFSET_Y,
  DEMO_CREEP_ROWS,
  DEMO_CREEP_SPACING,
  DEMO_CREEP_SPEED,
  DEMO_TOWERS,
  FIELD_RESOLUTION,
  MASS_CAPACITY,
  THERMOSTAT_OSCILLATION,
  WORLD_SIZE
} from '@/config/gameplay';

export class Game {
  private readonly canvas: CanvasManager;
  private readonly loop: GameLoop;
  private readonly field: PotentialField;
  private readonly towers: GravityWellTower[] = [];
  private readonly creeps: Creep[] = [];
  private readonly massManager = new MassManager(MASS_CAPACITY);
  private readonly hud: HudOverlay;
  private baselinePotential = BASELINE_PHI;
  private thermostatTimer = 0;

  constructor(private readonly container: HTMLElement) {
    this.canvas = new CanvasManager(container);
    this.hud = new HudOverlay(container);
    this.field = new PotentialField({
      width: WORLD_SIZE.x,
      height: WORLD_SIZE.y,
      resolution: FIELD_RESOLUTION,
      baseline: this.baselinePotential
    });

    this.seedDemoContent();
    this.field.rebuild(this.towers);

    this.loop = new GameLoop(
      (delta) => this.update(delta),
      (ctx) => this.render(ctx),
      this.canvas.ctx
    );
  }

  start(): void {
    this.loop.start();
  }

  dispose(): void {
    this.loop.stop();
    this.hud.dispose();
    this.canvas.dispose();
  }

  private update(deltaSeconds: number): void {
    this.thermostatTimer += deltaSeconds;
    const thermostatOscillation =
      Math.sin(this.thermostatTimer * THERMOSTAT_OSCILLATION.speed) *
      THERMOSTAT_OSCILLATION.amplitude;
    this.baselinePotential = BASELINE_PHI + thermostatOscillation;

    for (const tower of this.towers) {
      tower.tick(deltaSeconds);
    }

    this.field.setBaseline(this.baselinePotential);
    this.field.rebuild(this.towers);

    for (const creep of this.creeps) {
      creep.update(this.field, deltaSeconds);
    }

    this.hud.update({
      mass: this.massManager.snapshot(),
      baselinePotential: this.baselinePotential
    });
  }

  private render(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = '#030309';
    context.fillRect(0, 0, WORLD_SIZE.x, WORLD_SIZE.y);
    context.restore();

    this.field.draw(context, WORLD_SIZE);
    this.drawTowers(context);

    for (const creep of this.creeps) {
      creep.draw(context);
    }
  }

  private drawTowers(context: CanvasRenderingContext2D): void {
    for (const tower of this.towers) {
      context.save();
      context.strokeStyle = 'rgba(120, 180, 255, 0.8)';
      context.lineWidth = 2;
      context.setLineDash([8, 6]);
      context.beginPath();
      context.arc(tower.position.x, tower.position.y, tower.radius, 0, Math.PI * 2);
      context.stroke();

      context.setLineDash([]);
      context.fillStyle = 'rgba(60, 120, 255, 0.9)';
      context.beginPath();
      context.arc(tower.position.x, tower.position.y, 8, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }

  private seedDemoContent(): void {
    for (const [index, definition] of DEMO_TOWERS.entries()) {
      const tower = createGravityWell(
        `tower-${index}`,
        definition.position,
        definition.mass,
        definition.radius,
        definition.falloff,
        definition.maxForce,
        definition.pulse ?? 0,
        definition.period ?? 4
      );
      const spent = this.massManager.trySpend(tower.mass);
      if (spent) {
        this.towers.push(tower);
      }
    }

    for (let i = 0; i < DEMO_CREEP_ROWS; i += 1) {
      const creep = new Creep({
        id: `creep-${i}`,
        position: { x: 40, y: DEMO_CREEP_OFFSET_Y + i * DEMO_CREEP_SPACING },
        speed: DEMO_CREEP_SPEED,
        mass: DEMO_CREEP_MASS,
        color: `hsl(${200 + i * 10}, 70%, 70%)`
      });
      this.creeps.push(creep);
    }
  }
}

export function mountGame(container: HTMLElement): Game {
  const game = new Game(container);
  game.start();
  return game;
}
