import Attractor from './Attractor';
import Universe from './Universe';
import Vector, * as vector from './Vector';

export const particleTypes = [
    '#23a4ec',
    '#23ec68',
    '#ecd823',
    '#23e0ec',
    '#ec2f23',
    '#d023ec',
    '#ec9023',
    '#fefefe',
];
export type ParticleType = typeof particleTypes[number];

export interface Affinity {
    type: ParticleType;
    affinity: number;
}

export interface ParticleProperties {
    type: ParticleType;
    mass: number;
    affinities: Affinity[];
}

export class Particle {
    private _universe: Universe;
    private _type: ParticleType;
    private _position: Vector;
    private _velocity: Vector;
    private _force: Vector;

    constructor(
        universe: Universe,
        type: ParticleType,
        position: Vector,
        velocity: Vector
    ) {
        this._universe = universe;
        this._type = type;
        this._position = position;
        this._velocity = velocity;
        this._force = vector.ZERO();
    }

    public get type(): ParticleType {
        return this._type;
    }
    public get position(): Vector {
        return this._position;
    }
    public get velocity(): Vector {
        return this._velocity;
    }
    public get force(): Vector {
        return this._force;
    }

    public get mass(): number {
        const properties = this._universe
            .particleProperties
            .find((property) => property.type === this._type);
        return properties?.mass || 0;
    }

    public getAffinity(type: ParticleType): number {
        return this._universe.getAffinity(this._type, type);
    }

    public getAttractor(): Attractor {
        return new Attractor(this._type, this._position, 1);
    }

    public reflect(overshoot: Vector): void {
        this._position.add(overshoot.copy().multiply(2));

        if (overshoot.x != 0) this._velocity.reflect('x');
        if (overshoot.y != 0) this._velocity.reflect('y');
    }

    public applyForce(force: Vector): void {
        this._force.add(force);
    }

    public move(delta: number): void {
        const mass = this.mass;
        const acceleration: Vector =
            mass !== 0 ? this._force.copy().multiply(1 / mass) : vector.ZERO();

        // accelerate particle
        this._velocity.add(acceleration.copy().multiply(delta));

        // check if the particle velocity exceeded light speed
        const velocityModulus = this._velocity.modulus();
        if (velocityModulus >= this._universe.config.velocityCap) {
            this._velocity
                .normalize()
                .multiply(this._universe.config.velocityCap);
        }

        // apply viscosity
        this._velocity.multiply(1 - this._universe.config.viscosity);

        // move the particle
        this._position.add(this._velocity.copy().multiply(delta));

        // nullify forces
        this._force = vector.ZERO();
    }
}
