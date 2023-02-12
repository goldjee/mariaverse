import { ENERGY_DISSIPATION, VELOCITY_CAP } from './Space';
import Vector, * as vector from './Vector';

export const particleTypes = [
    'green',
    'red',
    'yellow',
    'blue',
    'cyan',
];
export type ParticleType = typeof particleTypes[number];

export class Particle {
    type: ParticleType;
    position: Vector;
    velocity: Vector;
    forces: Vector[];

    constructor(type: ParticleType, position: Vector, velocity: Vector) {
        this.type = type;
        this.position = position;
        this.velocity = velocity;
        this.forces = [];
    }

    public getMass(): number {
        return MASSES.get(this.type) || 0;
    }

    public getAffinity(type: ParticleType): number {
        return AFFINITIES.get(this.type)?.get(type) || 0;
    }

    public reflect(direction: vector.Direction) {
        this.velocity = vector.reflect(this.velocity, direction);
    }

    public applyForce(force: Vector) {
        this.forces.push(force);
    }

    public move(delta: number): void {
        const resultForce = vector.sum(...this.forces);
        const mass = this.getMass();
        const acceleration =
            mass !== 0 ? vector.multiply(resultForce, 1 / mass) : vector.ZERO;

        this.velocity = vector.sum(
            this.velocity,
            vector.multiply(acceleration, delta)
        );

        this.velocity = vector.multiply(this.velocity, 1 - ENERGY_DISSIPATION);

        const velocityModulus = vector.modulus(this.velocity);
        if (velocityModulus >= VELOCITY_CAP) {
            this.velocity = vector.multiply(
                vector.normalize(this.velocity),
                VELOCITY_CAP
            );
        }

        this.position = vector.sum(
            this.position,
            vector.multiply(this.velocity, delta)
        );

        this.forces = [];
    }
}

const MIN_MASS = 0.1;
const MAX_MASS = 1.5;
const MASSES: Map<ParticleType, number> = new Map<ParticleType, number>();
particleTypes.forEach((type) => {
    MASSES.set(type, Math.random() * (MAX_MASS - MIN_MASS) + MIN_MASS);
});

const MIN_AFFINITY = -10;
const MAX_AFFINITY = 10;
const AFFINITIES: Map<ParticleType, Map<ParticleType, number>> = new Map<
    ParticleType,
    Map<ParticleType, number>
>();
particleTypes.forEach((typeA) => {
    const charges = new Map<ParticleType, number>();
    particleTypes.forEach((typeB) => {
        charges.set(
            typeB,
            Math.random() * (MAX_AFFINITY - MIN_AFFINITY) + MIN_AFFINITY
        );
    });
    AFFINITIES.set(typeA, charges);
});

console.log(AFFINITIES);
