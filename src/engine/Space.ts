import { Particle, ParticleType, particleTypes } from './Particle';
import { rnd } from './random';
import { DEFAULT_CONFIG, SpaceConfig } from './SpaceConfig';
import Vector, { modulus, multiply, subtract, ZERO } from './Vector';

// inspired by https://www.youtube.com/watch?v=0Kx4Y9TVMGg

const debug = false;

class Space {
    private config: SpaceConfig;
    public masses: Map<ParticleType, number> = new Map();
    public affinities: Map<ParticleType, Map<ParticleType, number>> = new Map();
    particles: Particle[] = [];
    isRunning = false;

    constructor(config?: SpaceConfig) {
        this.config = config || DEFAULT_CONFIG;

        this.recreateRules();
        this.repopulate();
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

        this.particles.push(new Particle(this, type, position, velocity));
    }

    private addParticlePool(type: ParticleType) {
        const count = rnd(
            this.config.particleCountMax,
            this.config.particleCountMin
        );
        for (let i = 0; i < count; i++) this.addParticle(type);
    }

    public recreateRules(): void {
        this.masses = new Map<ParticleType, number>();
        particleTypes.forEach((type) => {
            this.masses.set(
                type,
                rnd(this.config.massMin, this.config.massMax)
            );
        });

        this.affinities = new Map<ParticleType, Map<ParticleType, number>>();
        particleTypes.forEach((typeA) => {
            const charges = new Map<ParticleType, number>();
            particleTypes.forEach((typeB) => {
                charges.set(
                    typeB,
                    rnd(this.config.affinityMin, this.config.affinityMax)
                );
            });
            this.affinities.set(typeA, charges);
        });
    }

    public repopulate(): void {
        this.isRunning = false;
        this.particles = [];

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
        this.config = config;
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

                executables.push(
                    this.applyForceField(particle, this.particles)
                );
            });

            await Promise.all(executables).then(() => {
                this.particles.forEach((particle) => {
                    particle.move(delta * this.config.slowMoFactor);
                });
            });
        }
    }

    private getForce(particle1: Particle, particle2: Particle): Vector {
        const r = subtract(particle1.position, particle2.position);
        const d = modulus(r);

        if (d > 0 && d <= this.config.forceDistanceCap) {
            let coefficient = 0;
            const affinityA = particle1.getAffinity(particle2.type);

            if (this.config.hasAsymmetricInteractions)
                coefficient =
                    (Math.sign(affinityA) * Math.abs(affinityA * affinityA)) /
                    d;
            else {
                const affinityB = particle2.getAffinity(particle1.type);
                coefficient = (affinityA * affinityB) / d;
            }

            return multiply(r, coefficient);
        } else return ZERO;
    }

    private async applyForceField(
        probe: Particle,
        particles: Particle[]
    ): Promise<void> {
        particles
            .filter((particle2) => {
                const r = subtract(probe.position, particle2.position);
                const d = modulus(r);
                return (
                    particle2 !== probe &&
                    d > 0 &&
                    d <= this.config.forceDistanceCap
                );
            })
            .forEach((particle2) => {
                probe.applyForce(this.getForce(probe, particle2));
            });
    }
}

export default Space;
