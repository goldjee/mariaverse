import {
    Particle,
    ParticleType,
    particleTypes,
} from './Particle';
import Vector, { modulus, multiply, subtract, ZERO } from './Vector';

// inspired by https://www.youtube.com/watch?v=0Kx4Y9TVMGg

const GRID_SIZE_X = 18000; // size in units
const GRID_SIZE_Y = 8000;

const PARTICLE_COUNT_MIN = 200;
const PARTICLE_COUNT_MAX = 200;

const VELOCITY_MIN = 0;
const VELOCITY_MAX = 0;
export const VELOCITY_CAP = 700;
export const ENERGY_DISSIPATION = 1e-5;

const SLOWMO_FACTOR = 1e-2;

const debug = false;

class Space {
    sizeX: number;
    sizeY: number;
    particles: Particle[];

    isRunning: boolean;

    constructor() {
        this.particles = [];
        this.sizeX = GRID_SIZE_X;
        this.sizeY = GRID_SIZE_Y;
        this.isRunning = true;

        if (debug) {
            this.addParticle(
                'green',
                {
                    x: GRID_SIZE_X / 2 - 20,
                    y: GRID_SIZE_X / 2,
                },
                { x: 0, y: 0 }
            );
            this.addParticle(
                'green',
                {
                    x: GRID_SIZE_Y / 2 + 20,
                    y: GRID_SIZE_Y / 2,
                },
                { x: 0, y: 0 }
            );
        } else {
            particleTypes.forEach((type) => {
                this.addParticlePool(type);
            });
        }
    }

    private addParticle(
        type: ParticleType,
        position?: Vector,
        velocity?: Vector
    ) {
        if (!position)
            position = {
                x: Math.random() * this.sizeX,
                y: Math.random() * this.sizeY,
            } as Vector;

        if (!velocity)
            velocity = {
                x: Math.random() * (VELOCITY_MAX - VELOCITY_MIN) + VELOCITY_MIN,
                y: Math.random() * (VELOCITY_MAX - VELOCITY_MIN) + VELOCITY_MIN,
            } as Vector;

        this.particles.push(new Particle(type, position, velocity));
    }

    private addParticlePool(type: ParticleType) {
        const count =
            Math.random() * (PARTICLE_COUNT_MAX - PARTICLE_COUNT_MIN) +
            PARTICLE_COUNT_MIN;
        for (let i = 0; i < count; i++) this.addParticle(type);
    }

    public async update(delta: number): Promise<void> {
        if (this.isRunning) {
            console.log(
                `FPS: ${Math.round(1000 / delta)}, frame time: ${delta} ms`
            );
            const executables: Promise<void>[] = [];
            this.particles.forEach((particle) => {
                if (
                    particle.position.x <= 0 ||
                    particle.position.x >= this.sizeX
                ) {
                    particle.reflect('x');
                    particle.position.x = Math.min(
                        Math.max(particle.position.x, 0),
                        this.sizeX
                    );
                }
                if (
                    particle.position.y <= 0 ||
                    particle.position.y >= this.sizeY
                ) {
                    particle.reflect('y');
                    particle.position.y = Math.min(
                        Math.max(particle.position.y, 0),
                        this.sizeY
                    );
                }

                executables.push(applyForceField(particle, this.particles));
            });

            await Promise.all(executables).then(() => {
                this.particles.forEach((particle) => {
                    particle.move(delta * SLOWMO_FACTOR);
                });
            });
        }
    }
}

function getForce(
    particle1: Particle,
    particle2: Particle,
): Vector {
    const r = subtract(particle1.position, particle2.position);
    const d = modulus(r);

    if (d > 0 && d <= 2000) {
        const affinityA = particle1.getAffinity(particle2.type);
        const affinityB = particle2.getAffinity(particle1.type);

        const coefficient =
            (affinityA * affinityB) / d;
        return multiply(r, coefficient);
    } else return ZERO;
}

async function applyForceField(
    probe: Particle,
    particles: Particle[]
): Promise<void> {
    particles
        .filter((particle2) => particle2 !== probe)
        .forEach((particle2) => {
            probe.applyForce(getForce(probe, particle2));
        });
}

export default Space;
