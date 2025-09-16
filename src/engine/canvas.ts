export interface CanvasDimensions {
  width: number;
  height: number;
  dpr: number;
}

export class CanvasManager {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private resizeObserver?: ResizeObserver;

  constructor(private readonly container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to acquire 2D rendering context');
    }

    this.context = context;
    this.container.appendChild(this.canvas);
    this.container.style.position = 'relative';
    this.handleResize();

    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.container);
    window.addEventListener('resize', () => this.handleResize());
  }

  get element(): HTMLCanvasElement {
    return this.canvas;
  }

  get ctx(): CanvasRenderingContext2D {
    return this.context;
  }

  dispose(): void {
    this.resizeObserver?.disconnect();
    this.canvas.remove();
  }

  private handleResize(): void {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.context.imageSmoothingEnabled = true;
  }
}
