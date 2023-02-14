import _ from 'lodash';
import {
    Affinity,
    Particle,
    ParticleProperties,
    ParticleType,
    particleTypes,
} from './Particle';
import { rnd } from './random';
import Sector from './Sector';
import { DEFAULT_CONFIG, SpaceConfig } from './SpaceConfig';
import Vector, { modulus, multiply, subtract, ZERO } from './Vector';

// inspired by https://www.youtube.com/watch?v=0Kx4Y9TVMGg

const debug = false;

class Space {
    private config: SpaceConfig;
    private gridSize: number;
    public particleProperties: ParticleProperties[] = [];
    sectors: Map<string, Sector> = new Map();
    isRunning = false;

    constructor(config?: SpaceConfig) {
        this.config = config || DEFAULT_CONFIG;
        this.gridSize = Math.ceil(
            (Math.max(this.config.sizeX, this.config.sizeY) /
                this.config.forceDistanceCap) *
                2
        );

        this.recreateParticleProperties();
        this.sectorize();
        this.repopulate();
        this.isRunning = true;
    }

    private sectorize() {
        const sectorSizeX = this.config.sizeX / this.gridSize;
        const sectorSizeY = this.config.sizeY / this.gridSize;

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const sector = new Sector(
                    { x: i * sectorSizeX, y: j * sectorSizeY },
                    { x: (i + 1) * sectorSizeX, y: (j + 1) * sectorSizeY }
                );
                this.sectors.set(JSON.stringify(sector.center), sector);
            }
        }

        // populating neighbors
        this.sectors.forEach((sector) => {
            for (
                let x = sector.center.x - sectorSizeX;
                x <= sector.center.x + sectorSizeX;
                x += sectorSizeX
            ) {
                for (
                    let y = sector.center.y - sectorSizeY;
                    y <= sector.center.y + sectorSizeY;
                    y += sectorSizeY
                ) {
                    const neighbor = this.findSector({ x, y });
                    if (neighbor) sector.neighbors.push(neighbor);
                }
            }
            sector.neighbors.push(sector);
            sector.neighbors = _.uniq(sector.neighbors);
        });
    }

    private findSector(position: Vector): Sector | undefined {
        const sectorSizeX = this.config.sizeX / this.gridSize;
        const sectorSizeY = this.config.sizeY / this.gridSize;

        const indexX = Math.ceil(position.x / sectorSizeX) - 1;
        const indexY = Math.ceil(position.y / sectorSizeY) - 1;
        const center: Vector = {
            x: indexX * sectorSizeX + sectorSizeX / 2,
            y: indexY * sectorSizeY + sectorSizeY / 2,
        };
        return this.sectors.get(JSON.stringify(center));
    }

    private clearSectors(): void {
        this.sectors.forEach((sector) => sector.clear());
    }

    private addParticle(
        type: ParticleType,
        position?: Vector,
        velocity?: Vector
    ) {
        if (!position)
            position = {
                x: rnd() * this.config.sizeX,
                y: rnd() * this.config.sizeY,
            } as Vector;

        if (!velocity)
            velocity = {
                x: this.config.velocityMax * rnd(-1, 1),
                y: this.config.velocityMax * rnd(-1, 1),
            } as Vector;

        const particle = new Particle(this, type, position, velocity);
        const sector = this.findSector(particle.position);
        sector?.addParticle(particle);
    }

    private addParticlePool(type: ParticleType) {
        const count = rnd(
            this.config.particleCountMax,
            this.config.particleCountMin
        );
        for (let i = 0; i < count; i++) this.addParticle(type);
    }

    public recreateParticleProperties(): void {
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

    public repopulate(): void {
        this.isRunning = false;
        this.clearSectors();

        if (debug) {
            this.addParticle(
                'green',
                {
                    x: this.config.sizeX / 2 - 20,
                    y: this.config.sizeY / 2,
                },
                { x: 0, y: 0 }
            );
            this.addParticle(
                'green',
                {
                    x: this.config.sizeX / 2 + 20,
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

    public getConfig(): SpaceConfig {
        return this.config;
    }

    public setConfig(config: SpaceConfig) {
        const isDimensionsChanged =
            this.config.sizeX !== config.sizeX ||
            this.config.sizeY !== config.sizeY;
        this.config = config;
        this.gridSize = Math.ceil(
            (Math.max(this.config.sizeX, this.config.sizeY) /
                this.config.forceDistanceCap) *
                2
        );

        if (isDimensionsChanged) {
            this.sectorize();
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

    public getParticles(): Particle[] {
        const result: Particle[] = [];
        this.sectors.forEach((sector) => {
            result.push(...sector.getParticles());
        });
        return result;
    }

    public update(delta: number): void {
        if (this.isRunning) {
            // console.log(
            //     `FPS: ${Math.round(1000 / delta)}, frame time: ${delta} ms`
            // );

            // console.log(`Particles total: ${this.getParticles().length}`);

            this.sectors.forEach((sector) => {
                if (sector.isEmpty()) return;

                sector.getParticles().forEach((particle) => {
                    this.applyForceField(particle, sector.neighbors);
                });
            });

            this.sectors.forEach((sector) => {
                sector.getParticles().forEach((particle) => {
                    // repel from walls
                    const { top, right, bottom, left } =
                        this.getWallProximity(particle);

                    const wallRepel = -1 * Math.abs(this.config.wallAffinity);
                    const wallRepelForces: Vector[] = [];
                    if (Math.abs(left.x) <= this.config.forceDistanceCap)
                        wallRepelForces.push(this.getForce(left, wallRepel));

                    if (Math.abs(right.x) <= this.config.forceDistanceCap)
                        wallRepelForces.push(this.getForce(right, wallRepel));

                    if (Math.abs(top.y) <= this.config.forceDistanceCap)
                        wallRepelForces.push(this.getForce(top, wallRepel));

                    if (Math.abs(bottom.y) <= this.config.forceDistanceCap)
                        wallRepelForces.push(this.getForce(bottom, wallRepel));

                    wallRepelForces.forEach((force) =>
                        particle.applyForce(force)
                    );

                    particle.move(delta * this.config.slowMoFactor);

                    // reflect from walls
                    this.fixParticlePosition(particle);

                    const newSector = this.findSector(particle.position);
                    if (newSector && newSector !== sector) {
                        sector.removeParticle(particle);
                        newSector.addParticle(particle);
                    }
                });
            });
        }
    }

    private getWallProximity(particle: Particle): {
        top: Vector;
        left: Vector;
        right: Vector;
        bottom: Vector;
    } {
        return {
            top: { x: 0, y: 0 - particle.position.y },
            left: { x: 0 - particle.position.x, y: 0 },
            right: {
                x: this.config.sizeX - particle.position.x,
                y: 0,
            },
            bottom: {
                x: 0,
                y: this.config.sizeY - particle.position.y,
            },
        };
    }

    private fixParticlePosition(particle: Particle): void {
        let isFixed = false;

        while (!isFixed) {
            const { top, right, bottom, left } =
                this.getWallProximity(particle);
            const errors = [left.x > 0, right.x < 0, top.y > 0, bottom.y < 0];

            if (errors[0]) particle.reflect(left);
            if (errors[1]) particle.reflect(right);
            if (errors[2]) particle.reflect(top);
            if (errors[3]) particle.reflect(bottom);

            isFixed = !(errors[0] || errors[1] || errors[2] || errors[3]);
        }
    }

    private getForce(r: Vector, affinityA: number, affinityB?: number): Vector {
        let d = modulus(r);

        if (d <= this.config.forceDistanceCap) {
            const flattenDistance = 1e-6;
            d = d <= flattenDistance ? flattenDistance : d;

            const coefficient =
                (!affinityB
                    ? Math.sign(affinityA) * Math.abs(affinityA * affinityA)
                    : affinityA * affinityB) / d;

            return multiply(r, coefficient);
        } else return ZERO;
    }

    private applyForceField(probe: Particle, neighborSectors: Sector[]): void {
        neighborSectors.forEach((sector) => {
            if (sector.isEmpty()) return;

            const attractors: {
                r: Vector;
                d: number;
                affinityA: number;
                affinityB: number | undefined;
                multiplier: number;
            }[] = [];

            if (!sector.hasParticle(probe)) {
                particleTypes.forEach((type) => {
                    const r = subtract(
                        probe.position,
                        sector.getChargeCenter(probe.type)
                    );
                    attractors.push({
                        r,
                        d: modulus(r),
                        affinityA: this.getAffinity(probe.type, type),
                        affinityB: this.config.hasAsymmetricInteractions
                            ? undefined
                            : this.getAffinity(type, probe.type),
                        multiplier: sector.getParticles(type).length,
                    });
                });
            } else {
                const neighbors = sector.getParticles();

                neighbors.forEach((neighbor) => {
                    const r = subtract(probe.position, neighbor.position);
                    const d = modulus(r);
                    if (d > this.config.forceDistanceCap) return;

                    attractors.push({
                        r,
                        d: modulus(r),
                        affinityA: this.getAffinity(probe.type, neighbor.type),
                        affinityB: this.config.hasAsymmetricInteractions
                            ? undefined
                            : this.getAffinity(neighbor.type, probe.type),
                        multiplier: 1,
                    });
                });
            }

            attractors.forEach((attractor) => {
                const force = multiply(
                    this.getForce(
                        attractor.r,
                        attractor.affinityA,
                        attractor.affinityB
                    ),
                    attractor.multiplier
                );
                probe.applyForce(force);
            });
        });
    }
}

export default Space;
