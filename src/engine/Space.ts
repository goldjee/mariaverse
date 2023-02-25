import _ from 'lodash';
import { Particle, ParticleType } from './Particle';
import Sector from './Sector';
import Universe from './Universe';
import { rnd } from './utils';
import Vector, { distance } from './Vector';

/**
 * This thing stores all particles in a structure optimized for performance
 */
class Space {
    private universe: Universe;
    private width: number;
    private height: number;
    private sectorCount: number;
    private sectorWidth: number;
    private sectorHeight: number;
    private sectors: Map<string, Sector>;

    constructor(universe: Universe) {
        this.universe = universe;

        // setting up core space parameters
        this.width = universe.config.sizeX;
        this.height = universe.config.sizeY;

        let size = Math.ceil(
            (Math.max(this.width, this.height) /
                universe.config.forceDistanceCap) *
                7
        );

        if (size === Infinity || size === undefined) size = 42;
        this.sectorCount = size;

        // dividing the space into sectors
        this.sectors = new Map<string, Sector>();
        this.sectorWidth = this.width / this.sectorCount;
        this.sectorHeight = this.height / this.sectorCount;

        for (let i = 0; i < this.sectorCount; i++) {
            for (let j = 0; j < this.sectorCount; j++) {
                const sector = new Sector(
                    new Vector(i * this.sectorWidth, j * this.sectorHeight),
                    new Vector(
                        (i + 1) * this.sectorWidth,
                        (j + 1) * this.sectorHeight
                    )
                );
                this.sectors.set(
                    JSON.stringify({ x: i, y: j } as Vector),
                    sector
                );
            }
        }

        // identifying neighbors of the sectors
        const offsetX =
            this.sectorWidth *
            Math.ceil(universe.config.forceDistanceCap / this.sectorWidth);
        const offsetY =
            this.sectorHeight *
            Math.ceil(universe.config.forceDistanceCap / this.sectorHeight);
        this.sectors.forEach((sector) => {
            for (
                let x = sector.center.x - offsetX;
                x <= sector.center.x + offsetX;
                x += this.sectorWidth
            ) {
                for (
                    let y = sector.center.y - offsetY;
                    y <= sector.center.y + offsetY;
                    y += this.sectorHeight
                ) {
                    const neighbor = this.findSector(new Vector(x, y));
                    if (
                        neighbor &&
                        neighbor !== sector &&
                        distance(neighbor.center, sector.center).modulus() <=
                            universe.config.forceDistanceCap
                    )
                        sector.neighbors.push(neighbor);
                }
            }
            if (sector.neighbors) sector.neighbors = _.uniq(sector.neighbors);
        });
    }

    /**
     * Finds sector which given point of space belongs to
     * @param position
     * @returns
     */
    public findSector(position: Vector): Sector | undefined {
        const index = new Vector(
            Math.min(
                Math.max(Math.floor(position.x / this.sectorWidth) - 1, 0),
                this.sectorCount - 1
            ),
            Math.min(
                Math.max(Math.floor(position.y / this.sectorHeight) - 1, 0),
                this.sectorCount - 1
            )
        );
        return this.sectors.get(JSON.stringify(index));
    }

    /**
     * Removes all particles from the space
     */
    public dropParticles(): void {
        this.sectors.forEach((sector) => sector.clear());
    }

    /**
     * Adds a new particle to the space
     * @param type Type of new particle
     * @param position Initial position
     * @param velocity Initial velocity
     */
    public addParticle(
        type: ParticleType,
        position?: Vector,
        velocity?: Vector
    ) {
        if (!position) position = new Vector(rnd(this.width), rnd(this.height));

        if (!velocity)
            velocity = new Vector(
                this.universe.config.velocityMax * rnd(-1, 1),
                this.universe.config.velocityMax * rnd(-1, 1)
            );

        const particle = new Particle(this.universe, type, position, velocity);
        const sector = this.findSector(particle.position);
        sector?.addParticle(particle);
    }

    /**
     *
     * @returns Array of all particles existing in the space
     */
    public getParticles(): Particle[] {
        const result: Particle[] = [];
        for (const sector of this.sectors.values()) {
            result.push(...sector.getParticles());
        }
        return result;
    }

    /**
     * Returns sectors of the space
     * @param nonEmpty If true, returns only sectors with at least one particle
     * @returns
     */
    public getSectors(nonEmpty?: boolean): Sector[] {
        if (!nonEmpty) return [...this.sectors.values()];
        else {
            const sectors: Sector[] = [];
            this.sectors.forEach((sector) => {
                if (!sector.isEmpty()) sectors.push(sector);
            });
            return sectors;
        }
    }

    /**
     * Identifies how close is the particle to edges of the space
     * @param particle
     * @returns Object containing list of vectors pointing to the edges
     */
    public getWallProximity(particle: Particle): {
        top: Vector;
        left: Vector;
        right: Vector;
        bottom: Vector;
    } {
        return {
            top: new Vector(0, 0 - particle.position.y),
            left: new Vector(0 - particle.position.x, 0),
            right: new Vector(this.width - particle.position.x, 0),
            bottom: new Vector(0, this.height - particle.position.y),
        };
    }

    /**
     * Tries to fix particle position when its velosity is so big that it travels for distance bigger than the space dimensions
     * @param particle
     */
    public fixParticlePosition(particle: Particle): void {
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
}

export default Space;
