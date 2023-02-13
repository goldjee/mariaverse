export function rnd(a?: number, b?: number): number {
    const min = Math.min(a || 1, b || 0);
    const max = Math.max(a || 1, b || 0);
    return Math.random() * (max - min) + min;
}