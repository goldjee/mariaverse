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
    return attractors.reduce((prev: Attractor[], currAttractor) => {
        if (!prev) return [currAttractor];

        const prevAttractor = prev.find(
            (attractor) => currAttractor.type === attractor.type
        );
        if (!prevAttractor) return [...prev, currAttractor];

        return [
            ...prev.filter((attractor) => attractor !== prevAttractor),
            new Attractor(
                currAttractor.type,
                multiply(
                    sum(
                        multiply(prevAttractor.position, prevAttractor.weight),
                        multiply(currAttractor.position, currAttractor.weight)
                    ),
                    1 / (prevAttractor.weight + currAttractor.weight)
                ),
                prevAttractor.weight + currAttractor.weight
            ),
        ];
    }, []);
}

export default Attractor;
