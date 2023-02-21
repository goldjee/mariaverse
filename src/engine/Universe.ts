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
import Vector, { distance } from './Vector';
import Space from './Space';
import getForce from './force';

// inspired by https://www.youtube.com/watch?v=0Kx4Y9TVMGg

class Universe {
    private _config: Config;
    public particleProperties: ParticleProperties[] = [];
    private _space: Space;
    private timeSinceLastDrift: number;
    private isRunning = false;

    constructor(config?: Config) {
        this._config = config || DEFAULT_CONFIG;
        this._space = new Space(this);

        this.setParticleProperties();
        this.repopulate();

        this.timeSinceLastDrift = 0;
        this.isRunning = true;
    }

    public get config(): Config {
        return this._config;
    }
    public set config(config: Config) {
        const isDimensionsChanged =
            this._config.sizeX !== config.sizeX ||
            this._config.sizeY !== config.sizeY ||
            this._config.forceDistanceCap !== config.forceDistanceCap;
        this._config = config;

        if (isDimensionsChanged) {
            this.setParticleProperties();
            this.repopulate();
        }
    }
    public get space(): Space {
        return this._space;
    }

    public setParticleProperties(): void {
        this.particleProperties = [];
        particleTypes.forEach((type) => {
            const affinities: Affinity[] = [];
            particleTypes.forEach((typeB) => {
                affinities.push({
                    type: typeB,
                    affinity: !this.config.isDebug
                        ? rnd(this.config.affinityMin, this.config.affinityMax)
                        : 1,
                });
            });

            this.particleProperties.push({
                type,
                mass: rnd(this.config.massMin, this.config.massMax),
                affinities,
            });
        });
    }

    private driftParticleProperties(): void {
        for (const property of this.particleProperties) {
            const newAffinities: Affinity[] = property.affinities.map(
                (affinity) => ({
                    type: affinity.type,
                    affinity:
                        -1 *
                        sign(affinity.affinity) *
                        rnd(this.config.affinityMin, this.config.affinityMax),
                })
            );
            property.affinities = newAffinities;
        }
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

        if (this.config.isDebug) {
            this.space.addParticle(
                particleTypes[0],
                new Vector(
                    this.config.sizeX / 2 - this.config.forceDistanceCap / 10,
                    this.config.sizeY / 2
                ),
                new Vector(0, 0)
            );
            this.space.addParticle(
                particleTypes[0],
                new Vector(
                    this.config.sizeX / 2 + this.config.forceDistanceCap / 10,
                    this.config.sizeY / 2
                ),
                new Vector(0, 0)
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

            if (this.config.driftPeriod && this.config.driftPeriod > 0)
                if (this.timeSinceLastDrift >= this.config.driftPeriod) {
                    this.driftParticleProperties();
                    this.timeSinceLastDrift = 0;
                }

            const sectors = this.space.getSectors(true);

            // particle interactions
            sectors.forEach((sector) => {
                const neighborAttractors: Attractor[] = [];
                sector.neighbors.forEach((neighbor) => {
                    if (neighbor.isEmpty()) return;

                    particleTypes.forEach((type) => {
                        const attractor = neighbor.getAttractor(type);
                        if (
                            attractor &&
                            distance(
                                attractor?.position,
                                sector.center
                            ).modulus() <= this.config.forceDistanceCap
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
                    const attractors: Attractor[] = localAttractors
                        .map((attractor) =>
                            exclude(particle.getAttractor(), attractor)
                        )
                        .filter(
                            (attractor): attractor is Attractor =>
                                attractor !== undefined &&
                                attractor.weight !== 0
                        );

                    this.applyForceField(particle, [
                        ...neighborAttractors,
                        ...attractors,
                    ]);
                });
            });

            // time step adaptation
            const maxVelocity = Math.max(
                ...sectors.flatMap((sector) =>
                    sector
                        .getParticles()
                        .map((particle) => particle.velocity.modulus())
                ),
                1e-6
            );
            let timeDilation = this.config.slowMoFactor;
            if (this.config.desiredPrecision)
                timeDilation = Math.min(
                    this.config.desiredPrecision / (maxVelocity * delta),
                    this.config.slowMoFactor
                );

            // particle updates
            sectors.forEach((sector) => {
                sector.getParticles().forEach((particle) => {
                    // repel from walls
                    const { top, right, bottom, left } =
                        this.space.getWallProximity(particle);

                    const wallRepel = -1 * Math.abs(this.config.wallAffinity); // this is positive because of vector direction
                    const wallRepelForces: Vector[] = [];
                    if (Math.abs(left.x) <= this.config.forceDistanceCap)
                        wallRepelForces.push(
                            getForce(left, left.modulus(), wallRepel)
                        );

                    if (Math.abs(right.x) <= this.config.forceDistanceCap)
                        wallRepelForces.push(
                            getForce(right, right.modulus(), wallRepel)
                        );

                    if (Math.abs(top.y) <= this.config.forceDistanceCap)
                        wallRepelForces.push(
                            getForce(top, top.modulus(), wallRepel)
                        );

                    if (Math.abs(bottom.y) <= this.config.forceDistanceCap)
                        wallRepelForces.push(
                            getForce(bottom, bottom.modulus(), wallRepel)
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

                particleTypes.forEach((type) => {
                    sector.updateAttractor(type);
                });
            });

            this.timeSinceLastDrift += delta;
        }
    }

    private applyForceField(probe: Particle, attractors: Attractor[]): void {
        attractors.forEach((attractor) => {
            const r = distance(probe.position, attractor.position);
            const d = r.modulus();
            if (d > this.config.forceDistanceCap) return;

            const affinityA = this.getAffinity(probe.type, attractor.type);
            const affinityB = this.config.hasAsymmetricInteractions
                ? undefined
                : this.getAffinity(attractor.type, probe.type);

            const force = getForce(r, d, affinityA, affinityB).multiply(
                attractor.weight
            );
            probe.applyForce(force);
        });
    }
}

export default Universe;
