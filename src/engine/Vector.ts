import { rnd } from './utils';

export class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * @returns Copy of this vector
     */
    public copy(): Vector {
        return new Vector(this.x, this.y);
    }

    /**
     * @returns Modulus of this vector
     */
    public modulus(): number {
        return (this.x * this.x + this.y * this.y) ** 0.5;
    }

    /**
     * Utility function to avoid calculation of square root
     * @returns Squared modulus of this vector
     */
    public modulusSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Adds a vector to this vector
     * @param vector Vector to add
     * @returns Mutated vector
     */
    public add(vector: Vector): Vector {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * Subtracts a vector from this vector
     * @param vector Vector to subtract
     * @returns Mutated vector
     */
    public subtract(vector: Vector): Vector {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    /**
     * Multiplies this vector by a given value
     * @param coefficient Multiplicator
     * @returns Mutated vector
     */
    public multiply(coefficient: number): Vector {
        this.x *= coefficient;
        this.y *= coefficient;
        return this;
    }

    /**
     * Reflects this vector against coordinate axis
     * @param direction Axis to reflect against
     * @returns Mutated vector
     */
    public reflect(direction: Direction): Vector {
        switch (direction) {
            case 'x':
                this.x *= -1;
                return this;
            case 'y':
                this.y *= -1;
                return this;
            case 'xy':
                this.reflect('x').reflect('y');
                return this;
        }
    }

    /**
     * Normalizes this vector
     * @returns Mutated vector
     */
    public normalize(): Vector {
        const scale = this.modulus();
        if (scale === 0) return this;

        this.x /= scale;
        this.y /= scale;
        return this;
    }
}

export type Direction = 'x' | 'y' | 'xy';

/**
 * Zero vector
 */
export function ZERO(): Vector {
    return new Vector(0, 0);
}

/**
 * Normalized vector with random directoion
 */
export function RANDOM(): Vector {
    return new Vector(rnd(-1, 1), rnd(-1, 1)).normalize();
}

/**
 * Calculates sum of vector array
 * @param vectors Array of vectors to sum
 * @returns Vector representing the sum
 */
export function sum(vectors: Vector[]): Vector {
    if (vectors.length === 0) return ZERO();

    const sum = ZERO();
    vectors.forEach((vector) => {
        sum.add(vector);
    });
    return sum;
}

/**
 * Calculates a distance between two points
 * @param pointA
 * @param pointB
 * @returns Vector with start at point A and end at point B
 */
export function distance(pointA: Vector, pointB: Vector): Vector {
    return pointB.copy().subtract(pointA);
}

export default Vector;
