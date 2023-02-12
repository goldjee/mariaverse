import { ENERGY_DISSIPATION, VELOCITY_CAP } from './Space';
import Vector, * as vector from './Vector';

export const particleTypes = ['green', 'red', 'grey', 'blue'];
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

    public getCharge(type: ChargeType): number {
        return CHARGES.get(this.type)?.get(type) || 0;
    }

    public reflect(direction: vector.Direction) {
        this.velocity = vector.reflect(this.velocity, direction);
    }

    public applyForce(force: Vector) {
        this.forces.push(force);
    }

    public move(delta: number): void {
        const resultForce = vector.sum(...this.forces);
        const mass = this.getCharge('mass');
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

export const chargeTypes = ['mass'];
particleTypes.forEach((type1) => {
    particleTypes.forEach((type2) => {
        chargeTypes.push(`${type1}_${type2}`);
    });
});
export type ChargeType = typeof chargeTypes[number];

const CHARGES: Map<ParticleType, Map<ChargeType, number>> = new Map<
    ParticleType,
    Map<ChargeType, number>
>();
particleTypes.forEach((particleType) => {
    const charges = new Map<ChargeType, number>();
    chargeTypes.forEach((type) => {
        charges.set(type, (Math.random() + type !== 'mass' ? - 1 : 0) * 3);
    });
    CHARGES.set(particleType, charges);
});
