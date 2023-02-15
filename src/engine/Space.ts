import _ from 'lodash';
import Attractor, { merge } from './Attractor';
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
import Vector, { distance, modulus, multiply, subtract } from './Vector';

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
        this.gridSize = Math.max(
            Math.ceil(
                (Math.max(this.config.sizeX, this.config.sizeY) /
                    this.config.forceDistanceCap) *
                    2
            ),
            20
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
        const offsetX =
            sectorSizeX * Math.ceil(this.config.forceDistanceCap / sectorSizeX);
        const offsetY =
            sectorSizeY * Math.ceil(this.config.forceDistanceCap / sectorSizeY);
        this.sectors.forEach((sector) => {
            for (
                let x = sector.center.x - offsetX;
                x <= sector.center.x + offsetX;
                x += sectorSizeX
            ) {
                for (
                    let y = sector.center.y - offsetY;
                    y <= sector.center.y + offsetY;
                    y += sectorSizeY
                ) {
                    const neighbor = this.findSector({ x, y });
                    if (neighbor && neighbor !== sector)
                        sector.neighbors.push(neighbor);
                }
            }
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
        this.gridSize = Math.max(
            Math.ceil(
                (Math.max(this.config.sizeX, this.config.sizeY) /
                    this.config.forceDistanceCap) *
                    2
            ),
            20
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

                let neighborSectorAttractors: Attractor[] = [];
                sector.neighbors.forEach((neighbor) => {
                    if (neighbor.isEmpty()) return;

                    particleTypes.forEach((type) => {
                        const attractor = neighbor.getAttractor(type);
                        if (
                            attractor &&
                            distance(attractor?.position, sector.center) <=
                                this.config.forceDistanceCap
                        )
                            neighborSectorAttractors.push(attractor);
                    });
                });
                neighborSectorAttractors = merge(neighborSectorAttractors); // costs accuracy

                sector.getParticles().forEach((particle) => {
                    let sameSectorAttractors: Attractor[] = [];
                    const neighbors = sector.getParticles();

                    neighbors.forEach((neighbor) => {
                        if (neighbor !== particle)
                            sameSectorAttractors.push(neighbor.getAttractor());
                    });
                    sameSectorAttractors = merge(sameSectorAttractors);
                    this.applyForceField(particle, [
                        ...neighborSectorAttractors,
                        ...sameSectorAttractors,
                    ]);
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

    private getForce(
        r: Vector,
        d: number,
        affinityA: number,
        affinityB?: number
    ): Vector {
        const flattenDistance = 1e-6;
        d = d <= flattenDistance ? flattenDistance : d;

        const resultAffinity = !affinityB
            ? sign(affinityA) * Math.abs(affinityA * affinityA)
            : affinityA * affinityB;
        const coefficient =
            Math.abs(resultAffinity) * (sign(resultAffinity) / d - 1 / d ** 3);

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

function sign(x: number) {
    return x ? (x < 0 ? -1 : 1) : x === x ? 0 : NaN;
}

export default Space;
