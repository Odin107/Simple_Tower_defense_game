export interface Vector2 {
  x: number;
  y: number;
}

export function add(a: Vector2, b: Vector2): Vector2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtract(a: Vector2, b: Vector2): Vector2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function multiplyScalar(v: Vector2, scalar: number): Vector2 {
  return { x: v.x * scalar, y: v.y * scalar };
}

export function length(v: Vector2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function normalize(v: Vector2, epsilon = 1e-6): Vector2 {
  const len = length(v);
  if (len < epsilon) {
    return { x: 0, y: 0 };
  }
  return { x: v.x / len, y: v.y / len };
}

export function clampMagnitude(v: Vector2, max: number): Vector2 {
  const len = length(v);
  if (len <= max) {
    return v;
  }
  const scale = max / (len || 1);
  return { x: v.x * scale, y: v.y * scale };
}
