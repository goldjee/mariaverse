import Attractor, { exclude } from './Attractor';
import {
    Affinity,
    Particle,
    ParticleProperties,
    ParticleType,
    particleTypes,
} from './Particle';
import { rnd, sign } from './utils';
import { DEFAULT_CONFIG, Config } from './Config';
import Vector, { distance, modulus, multiply, subtract } from './Vector';
import Space from './Space';

// inspired by https://www.youtube.com/watch?v=0Kx4Y9TVMGg

const debug = false;

class Universe {
    private config: Config;
    private particleProperties: ParticleProperties[] = [];
    private space: Space;
    isRunning = false;

    constructor(config?: Config) {
        this.config = config || DEFAULT_CONFIG;
        this.space = new Space(this);

        this.setParticleProperties();
        this.repopulate();
        this.isRunning = true;
    }

    public setParticleProperties(): void {
        this.particleProperties = [];
        particleTypes.forEach((type) => {
            const affinities: Affinity[] = [];
            particleTypes.forEach((typeB) => {
                affinities.push({
                    type: typeB,
                    affinity: rnd(
                        this.config.affinityMin,
                        this.config.affinityMax
                    ),
                });
            });

            this.particleProperties.push({
                type,
                mass: rnd(this.config.massMin, this.config.massMax),
                affinities,
            });
        });
    }

    private addParticlePool(type: ParticleType) {
        const count = rnd(
            this.config.particleCountMax,
            this.config.particleCountMin
        );
        for (let i = 0; i < count; i++) this.space.addParticle(type);
    }

    public repopulate(): void {
        this.isRunning = false;
        this.space.dropParticles();

        if (debug) {
            this.space.addParticle(
                particleTypes[0],
                {
                    x:
                        this.config.sizeX / 2 -
                        this.config.forceDistanceCap / 10,
                    y: this.config.sizeY / 2,
                },
                { x: 0, y: 0 }
            );
            this.space.addParticle(
                particleTypes[0],
                {
                    x:
                        this.config.sizeX / 2 +
                        this.config.forceDistanceCap / 10,
                    y: this.config.sizeY / 2,
                },
                { x: 0, y: 0 }
            );
        } else {
            particleTypes.forEach((type) => {
                this.addParticlePool(type);
            });
        }
        this.isRunning = true;
    }

    public getParticles(): Particle[] {
        return this.space.getParticles();
    }

    public getConfig(): Config {
        return this.config;
    }

    public setConfig(config: Config) {
        const isDimensionsChanged =
            this.config.sizeX !== config.sizeX ||
            this.config.sizeY !== config.sizeY ||
            this.config.forceDistanceCap !== config.forceDistanceCap;
        this.config = config;

        if (isDimensionsChanged) {
            this.setParticleProperties();
            this.repopulate();
        }
    }

    public getParticleProperties(): ParticleProperties[] {
        return this.particleProperties;
    }

    public getAffinity(typeA: ParticleType, typeB: ParticleType): number {
        const properties = this.getParticleProperties().find(
            (property) => property.type === typeA
        );
        if (!properties) return 0;

        const entry = properties.affinities.find(
            (entry) => entry.type === typeB
        );
        return entry?.affinity || 0;
    }

    public update(delta: number): void {
        if (this.isRunning) {
            // console.log(
            //     `FPS: ${Math.round(1000 / delta)}, frame time: ${delta} ms`
            // );

            // console.log(`Particles total: ${this.getParticles().length}`);

            const sectors = this.space.getSectors(true);

            sectors.forEach((sector) => {
                const neighborAttractors: Attractor[] = [];
                sector.neighbors.forEach((neighbor) => {
                    if (neighbor.isEmpty()) return;

                    particleTypes.forEach((type) => {
                        const attractor = neighbor.getAttractor(type);
                        if (
                            attractor &&
                            distance(attractor?.position, sector.center) <=
                                this.config.forceDistanceCap
                        )
                            neighborAttractors.push(attractor);
                    });
                });

                const localAttractors: Attractor[] = particleTypes
                    .map((type) => sector.getAttractor(type))
                    .filter(
                        (attractor) => attractor !== undefined
                    ) as Attractor[];

                sector.getParticles().forEach((particle) => {
                    const attractors: Attractor[] = localAttractors.map(
                        (attractor) =>
                            exclude(particle.getAttractor(), attractor)
                    );

                    this.applyForceField(particle, [
                        ...neighborAttractors,
                        ...attractors,
                    ]);
                });
            });

            const maxVelocity = Math.max(
                ...sectors.flatMap((sector) =>
                    sector
                        .getParticles()
                        .map((particle) => modulus(particle.velocity))
                ),
                1e-6
            );
            const timeDilation = Math.min(
                this.config.desiredPrecision / (maxVelocity * delta),
                // 1,
                this.config.slowMoFactor
            );

            sectors.forEach((sector) => {
                sector.getParticles().forEach((particle) => {
                    // repel from walls
                    const { top, right, bottom, left } =
                        this.space.getWallProximity(particle);

                    const wallRepel = 1 * Math.abs(this.config.wallAffinity); // this is positive because of vector direction
                    const wallRepelForces: Vector[] = [];
                    if (Math.abs(left.x) <= this.config.forceDistanceCap)
                        wallRepelForces.push(
                            this.getForce(left, modulus(left), wallRepel)
                        );

                    if (Math.abs(right.x) <= this.config.forceDistanceCap)
                        wallRepelForces.push(
                            this.getForce(right, modulus(right), wallRepel)
                        );

                    if (Math.abs(top.y) <= this.config.forceDistanceCap)
                        wallRepelForces.push(
                            this.getForce(top, modulus(top), wallRepel)
                        );

                    if (Math.abs(bottom.y) <= this.config.forceDistanceCap)
                        wallRepelForces.push(
                            this.getForce(bottom, modulus(bottom), wallRepel)
                        );

                    wallRepelForces.forEach((force) =>
                        particle.applyForce(force)
                    );

                    // particle.move(delta * this.config.slowMoFactor);
                    particle.move(delta * timeDilation);

                    // reflect from walls
                    this.space.fixParticlePosition(particle);

                    const newSector = this.space.findSector(particle.position);
                    if (newSector && newSector !== sector) {
                        sector.removeParticle(particle);
                        newSector.addParticle(particle);
                    }
                });
            });
        }
    }

    private getForce(
        r: Vector,
        d: number,
        affinityA: number,
        affinityB?: number
    ): Vector {
        // this is an adaptation of Lennard-Jones potential
        const ed = 1e2; // equilibrium distance
        const fd = 1e-4; // flattening distance
        const m = 1; // primary factor power
        const n = 2; // repulsion factor power
        d = d <= fd ? fd : d;

        const resultAffinity = !affinityB
            ? sign(affinityA) * affinityA ** 2
            : affinityA * affinityB;
        const coefficient =
            Math.abs(resultAffinity) *
            (-1 * sign(resultAffinity) * (ed / d) ** m - (ed / d) ** n);
        // const coefficient = -resultAffinity / d;

        return multiply(r, coefficient);
    }

    private applyForceField(probe: Particle, attractors: Attractor[]): void {
        attractors.forEach((attractor) => {
            const r = subtract(probe.position, attractor.position);
            const d = modulus(r);
            if (d > this.config.forceDistanceCap) return;

            const affinityA = this.getAffinity(probe.type, attractor.type);
            const affinityB = this.config.hasAsymmetricInteractions
                ? undefined
                : this.getAffinity(attractor.type, probe.type);

            const force = multiply(
                this.getForce(r, d, affinityA, affinityB),
                attractor.weight
            );
            probe.applyForce(force);
        });
    }
}

export default Universe;
