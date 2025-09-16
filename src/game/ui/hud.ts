import type { MassSnapshot } from '@/game/systems/massManager';

export interface HudData {
  mass: MassSnapshot;
  baselinePotential: number;
}

export class HudOverlay {
  private readonly element: HTMLDivElement;

  constructor(private readonly container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'ui-overlay';
    this.element.style.pointerEvents = 'none';
    this.container.appendChild(this.element);
  }

  update(data: HudData): void {
    const { mass, baselinePotential } = data;
    this.element.innerHTML = `
      <strong>Mass Budget</strong><br />
      Capacity: ${mass.capacity.toFixed(1)}<br />
      Available: ${mass.available.toFixed(1)}<br />
      Spent: ${mass.spent.toFixed(1)}<br />
      Baseline φ: ${baselinePotential.toFixed(2)}
    `;
  }

  dispose(): void {
    this.element.remove();
  }
}
