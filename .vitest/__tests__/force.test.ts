import getForce, { a1, a2, ed, fd, m, n, sd } from '../../src/engine/force';
import Vector, { distance } from '../../src/engine/Vector';

test('Parameters validity', () => {
    expect(ed).toBeGreaterThan(1);
    expect(a2).toBeGreaterThan(0);
    expect(m).toBeGreaterThan(0);
    expect(n).toBeGreaterThan(0);
    expect(m < n).toBe(true);
    expect(sd).toBeGreaterThan(0);
    expect(fd).toBeGreaterThan(1);
    expect(fd != sd).toBe(true);
    expect(fd - ed - sd !== 0).toBe(true);
    expect(fd < ed).toBe(true);
    expect(fd < ed).toBe(true);
    expect(fd < ed).toBe(true);
    expect(
        (a1 / Math.abs(fd - ed - sd)) ** m - (a2 / Math.abs(fd - ed - sd)) ** n
    ).toBeLessThan(0);
});

test('Force farther from equilibrium', () => {
    const attractor = new Vector(0, 0);
    const particle = new Vector(ed * 1e4, 0);
    const r = distance(particle, attractor);
    const d = r.modulus();
    const affinity = 1;
    const force = getForce(r, d, affinity);

    expect(force.modulus()).toBeGreaterThan(0);
    expect(force.x).toBeLessThan(0);
});

test('Repulsion', () => {
    const attractor = new Vector(0, 0);
    const particle = new Vector(ed / 2, 0);
    const r = distance(particle, attractor);
    const d = r.modulus();
    const affinity = 1;
    const force = getForce(r, d, affinity);

    expect(force.modulus()).toBeGreaterThan(0);
    expect(force.x).toBeGreaterThan(0);
});

test('Repulsion at attractor position', () => {
    const attractor = new Vector(0, 0);
    const particle = new Vector(0, 0);
    const r = distance(particle, attractor);
    const d = r.modulus();
    const affinity = 1;
    const force = getForce(r, d, affinity);

    expect(force.modulus()).toBeGreaterThan(0);
});
