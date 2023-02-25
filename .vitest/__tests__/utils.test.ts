import { rnd, sign } from '../../src/engine/utils';

test('Random values', () => {
    const RUN_COUNT = 1e4;

    for (let i = 0; i < RUN_COUNT; i++) {
        const valueA = rnd();
        const valueB = rnd(100);
        const valueC = rnd(-100);
        const valueD = rnd(100, -100);
        const valueE = rnd(100, 50);

        expect(valueA).toBeGreaterThanOrEqual(0);
        expect(valueA).toBeLessThanOrEqual(1);

        expect(valueB).toBeGreaterThanOrEqual(0);
        expect(valueB).toBeLessThanOrEqual(100);

        expect(valueC).toBeGreaterThanOrEqual(-100);
        expect(valueC).toBeLessThanOrEqual(0);

        expect(valueD).toBeGreaterThanOrEqual(-100);
        expect(valueD).toBeLessThanOrEqual(100);

        expect(valueE).toBeGreaterThanOrEqual(50);
        expect(valueE).toBeLessThanOrEqual(100);
    }
});

test('Sign', () => {
    expect(sign(0)).toBe(0);
    expect(sign(10)).toBe(1);
    expect(sign(-10)).toBe(-1);
    expect(sign(NaN)).toBe(NaN);
});
