import _ from 'lodash';
import { Particle, ParticleType } from './Particle';
import Vector from './Vector';

class Sector {
    topLeft: Vector;
    bottomRight: Vector;
    center: Vector;
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

        this.particles = new Map<ParticleType, Particle[]>();
        this.count = 0;
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

    public clear(): void {
        this.particles = new Map<ParticleType, Particle[]>();
        this.count = 0;
    }
}

export default Sector;
