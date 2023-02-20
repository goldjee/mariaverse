import Attractor, { exclude, merge } from '../Attractor';
import Vector from '../Vector';

const positionA = new Vector(0, 0);
const positionB = new Vector(100, 100);

test('Merge same type', () => {
    const attractorA = new Attractor('type', positionA, 1);
    const attractorB = new Attractor('type', positionA, 1);
    const attractorAB = merge([attractorA, attractorB])[0];

    expect(attractorA).toEqual(new Attractor('type', positionA, 1));
    expect(attractorB).toEqual(new Attractor('type', positionA, 1));
    expect(attractorAB).toEqual(new Attractor('type', positionA, 2));
});

test('Merge different types', () => {
    const attractorA = new Attractor('type', positionA, 1);
    const attractorB = new Attractor('other', positionA, 1);
    const attractorAB = merge([attractorA, attractorB]);

    expect(attractorAB.length).toBe(2);
    expect(attractorAB[0]).toEqual(attractorA);
    expect(attractorAB[1]).toEqual(attractorB);
});

test('Merge different positions', () => {
    const attractorA = new Attractor('type', positionA, 1);
    const attractorB = new Attractor('type', positionB, 1);
    const attractorAB = merge([attractorA, attractorB])[0];
    const position = new Vector(
        (positionA.x + positionB.x) / 2,
        (positionA.y + positionB.y) / 2
    );

    expect(attractorAB).toEqual(new Attractor('type', position, 2));
});

test('Exclude same types', () => {
    const attractorA = new Attractor('type', positionA, 1);
    const attractorB = new Attractor('type', positionA, 1);
    const attractorAB = merge([attractorA, attractorB])[0];

    let exclusion = exclude(attractorA, attractorAB);
    expect(exclusion).toEqual(attractorB);

    exclusion = exclude(attractorB, attractorAB);
    expect(exclusion).toEqual(attractorA);

    expect(exclude(attractorB, attractorA)).toBeUndefined();
    expect(exclude(attractorA, attractorB)).toBeUndefined();
});

test('Exclude different types', () => {
    const attractorA = new Attractor('type', positionA, 1);
    const attractorB = new Attractor('other', positionA, 1);

    expect(exclude(attractorB, attractorA)).toEqual(attractorA);
    expect(exclude(attractorA, attractorB)).toEqual(attractorB);
});
