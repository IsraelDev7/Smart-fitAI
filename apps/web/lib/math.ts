export function pct(value: number, target: number) {
  return Math.min(100, Math.round((value / target) * 100));
}
