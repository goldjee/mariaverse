export interface Config {
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

    viscosity: number;

    slowMoFactor: number;
    desiredPrecision: number;
}

export const DEFAULT_CONFIG = {
    sizeX: 18000,
    sizeY: 8000,

    particleCountMin: 500,
    particleCountMax: 500,

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
} as Config;
