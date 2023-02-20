import { ParticleType } from './Particle';
import Vector from './Vector';

class Attractor {
    private _type: ParticleType;
    private _position: Vector;
    private _weight: number;

    public get type(): ParticleType {
        return this._type;
    }
    public get position(): Vector {
        return this._position;
    }
    public set position(v: Vector) {
        this._position = v;
    }
    public get weight(): number {
        return this._weight;
    }
    public set weight(w: number) {
        this._weight = w;
    }

    constructor(type: ParticleType, position: Vector, weight: number) {
        this._type = type;
        this._position = position;
        this._weight = weight;
    }

    public copy(): Attractor {
        return new Attractor(this._type, this._position, this._weight);
    }
}

export function merge(attractors: Attractor[]): Attractor[] {
    const result: Map<ParticleType, Attractor> = new Map();

    for (const attractor of attractors) {
        const prevAttractor = result.get(attractor.type);
        if (!prevAttractor)
            result.set(
                attractor.type,
                new Attractor(
                    attractor.type,
                    attractor.position,
                    attractor.weight
                )
            );
        else {
            prevAttractor.position = prevAttractor.position
                .copy()
                .multiply(prevAttractor.weight)
                .add(attractor.position.copy().multiply(attractor.weight))
                .multiply(1 / (prevAttractor.weight + attractor.weight));
            prevAttractor.weight += attractor.weight;
        }
    }

    return [...result.values()];
}

export function exclude(
    attractor: Attractor,
    aggregate: Attractor
): Attractor | undefined {
    if (attractor.type !== aggregate.type) return aggregate;
    if (attractor.weight === aggregate.weight) return undefined;

    return new Attractor(
        aggregate.type,
        aggregate.position
            .copy()
            .multiply(aggregate.weight)
            .add(attractor.position.copy().multiply(-1 * attractor.weight))
            .multiply(aggregate.weight - attractor.weight),
        aggregate.weight - attractor.weight
    );
}

export default Attractor;
