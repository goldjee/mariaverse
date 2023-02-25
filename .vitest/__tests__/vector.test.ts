import Vector, { distance, sum } from '../../src/engine/Vector';

test('Copy', () => {
    const vec = new Vector(0, 0);
    const copy = vec.copy();

    expect(copy).toEqual(vec);
    expect(copy === vec).toBe(false);
});

test('Modulus', () => {
    const vecA = new Vector(0, 0);
    const vecB = new Vector(10, 0);
    const vecC = new Vector(0, 10);
    const vecD = new Vector(-10, 0);
    const vecE = new Vector(0, -10);
    const vecF = new Vector(10, 10);

    expect(vecA.modulus()).toBe(0);
    expect(vecB.modulus()).toBe(10);
    expect(vecC.modulus()).toBe(10);
    expect(vecD.modulus()).toBe(10);
    expect(vecE.modulus()).toBe(10);
    expect(vecF.modulus()).toBe(Math.sqrt(2) * 10);
});

test('Add', () => {
    const vecA = new Vector(0, 0);
    const vecB = new Vector(10, 10);
    const vecC = new Vector(-20, -20);

    vecA.add(vecB);
    expect(vecA).toEqual(new Vector(10, 10));

    vecA.add(vecC);
    expect(vecA).toEqual(new Vector(-10, -10));
});

test('Subtract', () => {
    const vecA = new Vector(0, 0);
    const vecB = new Vector(10, 10);
    vecA.subtract(vecB);

    expect(vecA).toEqual(new Vector(-10, -10));
});

test('Multiply', () => {
    const vecA = new Vector(0, 0);
    const vecB = new Vector(10, 10);
    const coefficient = 10;
    vecA.multiply(coefficient);
    vecB.multiply(coefficient);

    expect(vecA).toEqual(new Vector(0, 0));
    expect(vecB).toEqual(new Vector(100, 100));
});

test('Reflect', () => {
    const vec = new Vector(10, 10);

    vec.reflect('x');
    expect(vec).toEqual(new Vector(-10, 10));
    vec.reflect('y');
    expect(vec).toEqual(new Vector(-10, -10));
    vec.reflect('xy');
    expect(vec).toEqual(new Vector(10, 10));
});

test('Normalize', () => {
    const vecA = new Vector(0, 0);
    const vecB = new Vector(1, 0);
    const vecC = new Vector(-1, 0);
    const vecD = new Vector(1, 1);
    const vecE = new Vector(-1, -1);

    vecA.normalize();
    vecB.normalize();
    vecC.normalize();
    vecD.normalize();
    vecE.normalize();
    expect(vecA).toEqual(new Vector(0, 0));
    expect(vecB).toEqual(new Vector(1, 0));
    expect(vecC).toEqual(new Vector(-1, 0));
    expect(vecD).toEqual(new Vector(1 / Math.sqrt(2), 1 / Math.sqrt(2)));
    expect(vecE).toEqual(new Vector(-1 / Math.sqrt(2), -1 / Math.sqrt(2)));
});

test('Sum', () => {
    const vecA = new Vector(0, 0);
    const vecB = new Vector(1, 0);
    const vecC = new Vector(-1, 0);
    const vecD = new Vector(1, 1);
    const vecE = new Vector(-1, -1);

    expect(sum([])).toEqual(new Vector(0, 0));
    expect(sum([vecA, vecB])).toEqual(new Vector(1, 0));
    expect(sum([vecC, vecD])).toEqual(new Vector(0, 1));
    expect(sum([vecD, vecE])).toEqual(new Vector(0, 0));
    expect(sum([vecA, vecB, vecC, vecD, vecE])).toEqual(new Vector(0, 0));
});

test('Distance', () => {
    const vecA = new Vector(0, 0);
    const vecB = new Vector(1, 0);
    const vecC = new Vector(-1, 0);
    const vecD = new Vector(1, 1);
    const vecE = new Vector(-1, -1);

    expect(distance(vecA, vecB)).toEqual(new Vector(1, 0));
    expect(distance(vecB, vecA)).toEqual(new Vector(-1, 0));
    expect(distance(vecB, vecC)).toEqual(new Vector(-2, 0));
    expect(distance(vecC, vecB)).toEqual(new Vector(2, 0));
    expect(distance(vecD, vecE)).toEqual(new Vector(-2, -2));
    expect(distance(vecE, vecD)).toEqual(new Vector(2, 2));
});
