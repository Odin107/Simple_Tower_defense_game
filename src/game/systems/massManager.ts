export interface MassSnapshot {
  capacity: number;
  available: number;
  spent: number;
}

export class MassManager {
  private availableMass: number;
  private spentMass = 0;

  constructor(private readonly capacity: number) {
    this.availableMass = capacity;
  }

  trySpend(amount: number): boolean {
    if (amount > this.availableMass) {
      return false;
    }
    this.availableMass -= amount;
    this.spentMass += amount;
    return true;
  }

  refund(amount: number): void {
    this.availableMass = Math.min(this.availableMass + amount, this.capacity);
    this.spentMass = Math.max(this.spentMass - amount, 0);
  }

  snapshot(): MassSnapshot {
    return {
      capacity: this.capacity,
      available: this.availableMass,
      spent: this.spentMass
    };
  }
}
