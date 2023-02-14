export interface SpaceConfig {
    sizeX: number;
    sizeY: number;

    particleCountMin: number;
    particleCountMax: number;

    massMin: number;
    massMax: number;

    affinityMin: number;
    affinityMax: number;
    wallAffinity: number;

    velocityCap: number;
    velocityMax: number;

    forceDistanceCap: number;
    hasAsymmetricInteractions: boolean;

    energyDissipationFactor: number;

    slowMoFactor: number;
}

export const DEFAULT_CONFIG = {
    sizeX: 18000,
    sizeY: 8000,

    particleCountMin: 500,
    particleCountMax: 500,

    massMin: 0.1,
    massMax: 1.5,

    affinityMin: -100,
    affinityMax: 100,

    wallAffinity: -50,

    velocityCap: 2700,
    velocityMax: 2700 / 40,

    forceDistanceCap: 1500,
    hasAsymmetricInteractions: true,

    energyDissipationFactor: 1e-6,

    slowMoFactor: 1e-3,
} as SpaceConfig;
