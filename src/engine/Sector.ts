import _ from 'lodash';
import Attractor, { exclude, merge } from './Attractor';
import { Particle, ParticleType } from './Particle';
import Vector from './Vector';

class Sector {
    topLeft: Vector;
    bottomRight: Vector;
    center: Vector;
    particles: Map<ParticleType, Particle[]>;
    attractors: Map<ParticleType, Attractor>;
    count: number;
    neighbors: Sector[] = [];

    constructor(topLeft: Vector, bottomRight: Vector) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;

        this.center = new Vector(
            (topLeft.x + bottomRight.x) / 2,
            (topLeft.y + bottomRight.y) / 2
        );

        this.particles = new Map<ParticleType, Particle[]>();
        this.attractors = new Map<ParticleType, Attractor>();
        this.count = 0;
    }

    public getAttractor(type: ParticleType): Attractor | undefined {
        return this.attractors.get(type);
    }

    public updateAttractor(type: ParticleType): void {
        const particles = this.particles.get(type);

        if (!particles || particles.length === 0) return undefined;

        const attractors = particles.map((particle) => particle.getAttractor());

        const attractor = merge(attractors).find(
            (attractor) => attractor.type === type
        );
        if (!attractor) this.attractors.delete(type);
        else this.attractors.set(type, attractor);
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

        // this.updateAttractor(particle.type);
        const attractor = this.getAttractor(particle.type);
        if (!attractor)
            this.attractors.set(particle.type, particle.getAttractor());
        else
            this.attractors.set(
                particle.type,
                merge([attractor, particle.getAttractor()])[0]
            );
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

        // this.updateAttractor(particle.type);
        const attractor = this.getAttractor(particle.type);
        if (!attractor) return;
        else {
            const newAttractor = exclude(particle.getAttractor(), attractor);
            if (!newAttractor) this.attractors.delete(attractor.type);
            else this.attractors.set(attractor.type, newAttractor);
        }
    }

    public isEmpty(): boolean {
        return this.count === 0;
    }

    public clear(): void {
        this.particles = new Map<ParticleType, Particle[]>();
        this.attractors = new Map<ParticleType, Attractor>();
        this.count = 0;
    }
}

export default Sector;
