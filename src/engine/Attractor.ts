import { ParticleType } from './Particle';
import Vector, { multiply, sum } from './Vector';

class Attractor {
    type: ParticleType;
    position: Vector;
    weight: number;

    constructor(type: ParticleType, position: Vector, weight: number) {
        this.type = type;
        this.position = position;
        this.weight = weight;
    }
}

export function merge(attractors: Attractor[]): Attractor[] {
    const result: Map<ParticleType, Attractor> = new Map();

    for (const attractor of attractors) {
        const prevAttractor = result.get(attractor.type);
        if (!prevAttractor) result.set(attractor.type, attractor);
        else {
            prevAttractor.position = multiply(
                sum(
                    multiply(prevAttractor.position, prevAttractor.weight),
                    multiply(attractor.position, attractor.weight)
                ),
                1 / (prevAttractor.weight + attractor.weight)
            );
            prevAttractor.weight = prevAttractor.weight + attractor.weight;
        }
    }

    return [...result.values()];
}

export function exclude(attractor: Attractor, aggregate: Attractor): Attractor {
    if (attractor.type !== aggregate.type) return aggregate;

    return new Attractor(
        aggregate.type,
        sum(
            aggregate.position,
            multiply(
                attractor.position,
                (-1 * attractor.weight) / aggregate.weight
            )
        ),
        aggregate.weight - attractor.weight
    );
}

export default Attractor;
