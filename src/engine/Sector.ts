import _ from 'lodash';
import { Particle, ParticleType, particleTypes } from './Particle';
import Vector, { sum } from './Vector';

class Sector {
    topLeft: Vector;
    bottomRight: Vector;
    center: Vector;
    chargeCenters: Map<ParticleType, Vector>;
    particles: Map<ParticleType, Particle[]>;
    count: number;
    neighbors: Sector[] = [];

    constructor(topLeft: Vector, bottomRight: Vector) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;

        this.center = {
            x: (topLeft.x + bottomRight.x) / 2,
            y: (topLeft.y + bottomRight.y) / 2,
        } as Vector;
        this.chargeCenters = new Map<ParticleType, Vector>();

        this.particles = new Map<ParticleType, Particle[]>();
        this.count = 0;
    }

    private updateChargeCenters(type?: ParticleType): void {
        const types = type ? [type] : particleTypes;

        this.particles.forEach((particles, type) => {
            if (types.includes(type)) {
                if (particles.length === 0) {
                    this.chargeCenters.delete(type);
                    return;
                }

                const center = sum(
                    ...particles.map((particle) => particle.position)
                );
                this.chargeCenters.set(type, center);
            }
        });
    }

    public getParticles(type?: ParticleType): Particle[] {
        if (this.count === 0) return [];

        if (type) return this.particles.get(type) || [];
        else {
            const result: Particle[] = [];
            this.particles.forEach((store) => result.push(...store));
            return result;
        }
    }

    public addParticle(particle: Particle): void {
        let store = this.particles.get(particle.type);
        if (!store) {
            store = [];
            this.particles.set(particle.type, store);
        }

        store.push(particle);
        this.count = this.count + 1;
        this.updateChargeCenters(particle.type);
    }

    public hasParticle(particle: Particle): boolean {
        return this.getParticles(particle.type).includes(particle);
    }

    public removeParticle(particle: Particle): void {
        const store = this.getParticles(particle.type);
        if (store) {
            _.pull(store, particle);
        }
        this.count = this.count - 1;
    }

    public isEmpty(): boolean {
        return this.count === 0;
    }

    public getChargeCenter(type: ParticleType): Vector {
        return this.chargeCenters.get(type) || this.center;
    }

    public clear(): void {
        this.particles = new Map<ParticleType, Particle[]>();
        this.count = 0;
    }
}

export default Sector;
