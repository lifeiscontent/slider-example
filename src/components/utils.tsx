export function mapRange(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
) {
  return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
}

export function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(value, max));
}

export function stepClamp(
  min: number,
  max: number,
  step: number,
  value: number
): number {
  return value <= min
    ? min
    : value >= max
    ? max
    : value + step - 1 - ((value + step - 1) % step);
}
