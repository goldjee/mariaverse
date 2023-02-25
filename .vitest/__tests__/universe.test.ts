import Attractor from '../../src/engine/Attractor';
import { Config } from '../../src/engine/Config';
import { particleTypes } from '../../src/engine/Particle';
import Universe from '../../src/engine/Universe';
import Vector from '../../src/engine/Vector';

const config = {
    sizeX: 18000,
    sizeY: 8000,

    particleCountMin: 1,
    particleCountMax: 1,

    massMin: 1,
    massMax: 1,
    affinityMin: -10,
    affinityMax: 10,

    wallAffinity: -10,

    velocityCap: 72e2,
    velocityMax: 2700 / 40,

    forceDistanceCap: 1500,
    hasAsymmetricInteractions: true,

    viscosity: 0.3,

    slowMoFactor: 1e-3,
    desiredPrecision: 1e2,

    isDebug: true,
} as Config;

class UniverseWrapper extends Universe {
    constructor(config: Config) {
        super(config);
    }
}

const universe = new UniverseWrapper(config);
const space = universe.space;

// universe tests
test('Universe config', () => {
    expect(universe.config).toEqual(config);
});

// space tests
test('Space sectors division', () => {
    const sectors = space.getSectors();
    let topLeft: Vector | undefined = undefined,
        bottomRight: Vector | undefined = undefined;

    sectors.forEach((sector) => {
        if (topLeft && bottomRight) {
            if (topLeft.x >= sector.topLeft.x && topLeft.y >= sector.topLeft.y)
                topLeft = sector.topLeft;

            if (
                bottomRight.x <= sector.bottomRight.x &&
                bottomRight.y <= sector.bottomRight.y
            )
                bottomRight = sector.bottomRight;

            return;
        }

        if (!topLeft) topLeft = sector.topLeft;
        if (!bottomRight) bottomRight = sector.bottomRight;
    });

    expect(topLeft).toBeDefined();
    expect(bottomRight).toBeDefined();
    expect((topLeft as unknown as Vector).x).toBe(0);
    expect((topLeft as unknown as Vector).y).toBe(0);
    expect((bottomRight as unknown as Vector).x).toBe(config.sizeX);
    expect((bottomRight as unknown as Vector).y).toBe(config.sizeY);
});

test('Particles creation', () => {
    const particles = space.getParticles();
    expect(particles.length).toBe(2);
});

test('Particle to sector relation', () => {
    const particles = space.getParticles();
    const sectors = space.getSectors().filter((sector) => !sector.isEmpty());
    expect(sectors.length).toBe(2);

    sectors.forEach((sector) => {
        const sectorParticles = sector.getParticles();
        expect(sectorParticles.length).toBe(1);
        expect(particles.includes(sectorParticles[0])).toBeTruthy();
    });
});

test('Particle attractors', () => {
    const particles = space.getParticles();
    const particlePositions = particles.map((particle) => particle.position);

    const particleAttractors = particles.map((particle) =>
        particle.getAttractor()
    );
    const particleAttractorPositions = particleAttractors.map(
        (attractor) => attractor.position
    );

    expect(particleAttractorPositions).toEqual(particlePositions);
});

function testPositions() {
    test('Positions of sector attractors', () => {
        const sectors = space.getSectors(true);
        const sectorAttractors: Attractor[] = [];

        particleTypes.forEach((type) => {
            sectors.forEach((sector) => {
                const attractor = sector.getAttractor(type);
                if (attractor) {
                    sectorAttractors.push(attractor);
                    expect(space.findSector(attractor.position)).toBeDefined();
                    expect(
                        space.findSector(attractor.position)?.center
                    ).toEqual(sector.center);
                }
            });
        });

        expect(sectorAttractors.length).toBe(2);

        const particlePositions = space
            .getParticles()
            .map((particle) => particle.position);
        sectorAttractors.forEach((attractor) => {
            expect(particlePositions.includes(attractor.position)).toBe(true);
        });
    });
}

testPositions();
universe.update(1e-4);
testPositions();
