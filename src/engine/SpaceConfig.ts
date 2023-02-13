export interface SpaceConfig {
    sizeX: number;
    sizeY: number;

    particleCountMin: number;
    particleCountMax: number;

    minMass: number;
    maxMass: number;

    minAffinity: number;
    maxAffinity: number;

    velocityCap: number;
    velocityMax: number;

    forceDistanceLimit: number;
    hasAsymmetricInteractions: boolean;

    energyDissipationFactor: number;

    slowMoFactor: number;
}

export const defaultConfig = {
    sizeX: 18000,
    sizeY: 8000,

    particleCountMin: 300,
    particleCountMax: 300,

    minMass: 0.1,
    maxMass: 1.5,

    minAffinity: -10,
    maxAffinity: 10,

    velocityCap: 2700,
    velocityMax: 2700 / 40,

    forceDistanceLimit: 1500,
    hasAsymmetricInteractions: true,

    energyDissipationFactor: 1e-5,

    slowMoFactor: 1e-3,
};
