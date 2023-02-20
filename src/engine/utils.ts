/**
 * Returns random value
 * @param a First boundary value. If not provided, function will return random value between 0 and 1.
 * @param b Second boundary value. If not provided, function will return random value between 0 and a.
 * @returns Random value between a and b
 */
export function rnd(a?: number, b?: number): number {
    const min = Math.min(a || 1, b || 0);
    const max = Math.max(a || 1, b || 0);
    return Math.random() * (max - min) + min;
}

/**
 * Analog to Math.sign(), but expected to be a bit faster.
 * @param x 
 * @returns Sign of x
 */
export function sign(x: number) {
    return x ? (x < 0 ? -1 : 1) : x === x ? 0 : NaN;
}
