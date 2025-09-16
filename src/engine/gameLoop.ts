export type UpdateFunction = (deltaSeconds: number) => void;
export type RenderFunction = (context: CanvasRenderingContext2D) => void;

const MAX_DELTA = 1 / 15; // clamp to avoid huge steps on tab refocus

export class GameLoop {
  private rafHandle: number | null = null;
  private lastTime = 0;

  constructor(
    private readonly update: UpdateFunction,
    private readonly render: RenderFunction,
    private readonly context: CanvasRenderingContext2D
  ) {}

  start(): void {
    if (this.rafHandle !== null) {
      return;
    }

    this.lastTime = performance.now();
    const tick = (time: number) => {
      const deltaSeconds = Math.min((time - this.lastTime) / 1000, MAX_DELTA);
      this.lastTime = time;
      this.update(deltaSeconds);
      this.render(this.context);
      this.rafHandle = requestAnimationFrame(tick);
    };

    this.rafHandle = requestAnimationFrame(tick);
  }

  stop(): void {
    if (this.rafHandle !== null) {
      cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }
  }
}
