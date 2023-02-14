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
import Vector, { distance, modulus, multiply, subtract, ZERO } from './Vector';

// inspired by https://www.youtube.com/watch?v=0Kx4Y9TVMGg

const GRID_SIZE = 20;
const debug = false;

class Space {
    private config: SpaceConfig;
    public particleProperties: ParticleProperties[] = [];
    sectors: Map<string, Sector> = new Map();
    isRunning = false;

    constructor(config?: SpaceConfig) {
        this.config = config || DEFAULT_CONFIG;

        this.recreateParticleProperties();
        this.sectorize();
        this.repopulate();
        this.isRunning = true;
    }

    private sectorize() {
        const sectorSizeX = this.config.sizeX / GRID_SIZE;
        const sectorSizeY = this.config.sizeY / GRID_SIZE;

        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const sector = new Sector(
                    { x: i * sectorSizeX, y: j * sectorSizeY },
                    { x: (i + 1) * sectorSizeX, y: (j + 1) * sectorSizeY }
                );
                this.sectors.set(JSON.stringify(sector.center), sector);
            }
        }

        // populating neighbors
        this.sectors.forEach((sector) => {
            for (let x = sector.center.x - sectorSizeX; x <= sector.center.x + sectorSizeX; x += sectorSizeX) {
                for (let y = sector.center.y - sectorSizeY; y <= sector.center.y + sectorSizeY; y += sectorSizeY) {
                    const neighbor = this.findSector({x, y});
                    if (neighbor) sector.neighbors.push(neighbor);
                }
            }
            sector.neighbors.push(sector);
            sector.neighbors = _.uniq(sector.neighbors);
        });
    }

    private findSector(position: Vector): Sector | undefined {
        const sectorSizeX = this.config.sizeX / GRID_SIZE;
        const sectorSizeY = this.config.sizeY / GRID_SIZE;

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

            this.sectors.forEach((sector) => {
                if (sector.isEmpty()) return;

                sector.getParticles().forEach((particle) => {
                    this.applyForceField(particle, sector.neighbors);
                });
            });

            this.sectors.forEach((sector) => {
                sector.getParticles().forEach((particle) => {
                    particle.move(delta * this.config.slowMoFactor);

                    if (
                        particle.position.x <= 0 ||
                        particle.position.x >= this.config.sizeX
                    ) {
                        particle.reflect('x');
                        particle.position.x = Math.min(
                            Math.max(particle.position.x, 0),
                            this.config.sizeX
                        );
                    }
                    if (
                        particle.position.y <= 0 ||
                        particle.position.y >= this.config.sizeY
                    ) {
                        particle.reflect('y');
                        particle.position.y = Math.min(
                            Math.max(particle.position.y, 0),
                            this.config.sizeY
                        );
                    }

                    const newSector = this.findSector(particle.position);
                    if (newSector && newSector !== sector) {
                        sector.removeParticle(particle);
                        newSector.addParticle(particle);
                    }
                });
            });
        }
    }

    private getForce(r: Vector, affinityA: number, affinityB: number): Vector {
        const d = modulus(r);

        if (d > 0 && d <= this.config.forceDistanceCap) {
            let coefficient = 0;

            if (this.config.hasAsymmetricInteractions)
                coefficient =
                    (Math.sign(affinityA) * Math.abs(affinityA * affinityA)) /
                    d;
            else coefficient = (affinityA * affinityB) / d;

            return multiply(r, coefficient);
        } else return ZERO;
    }

    private applyForceField(probe: Particle, neighborSectors: Sector[]): void {
        neighborSectors.forEach((sector) => {
            if (sector.isEmpty()) return;

            const rSector = subtract(probe.position, sector.center);
            const dSector = modulus(rSector);
            if (dSector > this.config.forceDistanceCap) return;

            if (!sector.hasParticle(probe)) {
                particleTypes.forEach((type) => {
                    const particleCount = sector.getParticles(type).length;
                    const affinityA = this.getAffinity(probe.type, type);
                    const affinityB = this.getAffinity(type, probe.type);
                    const force = multiply(
                        this.getForce(rSector, affinityA, affinityB),
                        particleCount
                    );
                    probe.applyForce(force);
                });
            } else {
                const neighbors = sector.getParticles();

                neighbors.forEach((neighbor) => {
                    const r = subtract(probe.position, neighbor.position);
                    const affinityA = this.getAffinity(
                        probe.type,
                        neighbor.type
                    );
                    const affinityB = this.getAffinity(
                        neighbor.type,
                        probe.type
                    );
                    const force = this.getForce(r, affinityA, affinityB);
                    probe.applyForce(force);
                });
            }
        });
    }
}

export default Space;
