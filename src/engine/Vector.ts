interface Vector {
    x: number;
    y: number;
}

export type Direction = 'x' | 'y' | 'xy';

export const ZERO = {x: 0, y: 0};

export function modulus(vector: Vector): number {
    return (vector.x * vector.x + vector.y * vector.y) ** .5;
}

export function sum(...vectors: Vector[]): Vector {
    let result: Vector = ZERO;

    if (vectors.length > 0)
        result = vectors.reduce(
            (sum, vector) =>
                (result = { x: sum.x + vector.x, y: sum.y + vector.y }),
            result
        );

    return result;
}

export function subtract(vector1: Vector, vector2: Vector): Vector {
    return {
        x: vector1.x - vector2.x,
        y: vector1.y - vector2.y,
    };
}

export function multiply(vector: Vector, coefficient: number): Vector {
    return { x: vector.x * coefficient, y: vector.y * coefficient };
}

export function distance(pointA: Vector, pointB: Vector): number {
    return modulus(subtract(pointB, pointA));
}

export function reflect(vector: Vector, direction: Direction): Vector {
    switch (direction) {
        case 'x':
            return { x: -1 * vector.x, y: vector.y };
        case 'y':
            return { x: vector.x, y: -1 * vector.y };
        case 'xy':
            return { x: -1 * vector.x, y: -1 * vector.y };
    }
}

export function normalize(vector: Vector): Vector {
    const scale = modulus(vector);
    return {
        x: vector.x / scale,
        y: vector.y / scale,
    } as Vector;
}

export default Vector;
