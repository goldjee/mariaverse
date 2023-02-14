import Space from './Space';
import Vector, * as vector from './Vector';

export const particleTypes = [
    'green',
    'red',
    'yellow',
    'blue',
    'cyan',
    'magenta',
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
    space: Space;
    type: ParticleType;
    position: Vector;
    velocity: Vector;
    force: Vector;

    constructor(space: Space, type: ParticleType, position: Vector, velocity: Vector) {
        this.space = space;
        this.type = type;
        this.position = position;
        this.velocity = velocity;
        this.force = vector.ZERO;
    }

    public getMass(): number {
        const properties = this.space.getParticleProperties().find((property) => property.type === this.type);
        return properties?.mass || 0;
    }

    public getAffinity(type: ParticleType): number {
        return this.space.getAffinity(this.type, type);
    }

    public reflect(direction: vector.Direction) {
        this.velocity = vector.reflect(this.velocity, direction);
    }

    public applyForce(force: Vector) {
        this.force = vector.sum(this.force, force);
    }

    public move(delta: number): void {
        const mass = this.getMass();
        const acceleration =
            mass !== 0 ? vector.multiply(this.force, 1 / mass) : vector.ZERO;

        this.velocity = vector.sum(
            this.velocity,
            vector.multiply(acceleration, delta)
        );

        this.velocity = vector.multiply(this.velocity, 1 - this.space.getConfig().energyDissipationFactor);

        const velocityModulus = vector.modulus(this.velocity);
        if (velocityModulus >= this.space.getConfig().velocityCap) {
            this.velocity = vector.multiply(
                vector.normalize(this.velocity),
                this.space.getConfig().velocityCap
            );
        }

        this.position = vector.sum(
            this.position,
            vector.multiply(this.velocity, delta)
        );

        this.force = vector.ZERO;
    }
}
