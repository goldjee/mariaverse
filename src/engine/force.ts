import { sign } from './utils';
import Vector, { RANDOM } from './Vector';

// parameters
export const ed = 5; // equilibrium distance
export const a = 1e1; // overall multiplier
export const a1 = 5e-1; // primary component amplifier
export const a2 = 1; // repulsion component amplifier
export const m = 1; // primary factor power, must be greater than repulsion factor
export const n = 2; // repulsion factor power
export const sd = Math.pow(a2 / a1, 1 / (m - n)); // distance from the equilibrium to singularity
export const fd = ed - 1e-6; // flattening distance

/**
 * An adaptation of Lennard-Jones potential
 * @param r Vector pointing from probe particle to attractor
 * @param d Precalculated distance, must be equal to r.modulus()
 * @param affinityA Affinity of the probe to the attractor
 * @param affinityB Affinity of the attractor to the probe
 * @returns Vector of force influencing the probe particle
 */
function getForce(
    r: Vector,
    d: number,
    affinityA: number,
    affinityB?: number
): Vector {
    let R = r.copy();
    // if particle is at attractor poin, it should repel anyway
    if (d === 0) {
        R = RANDOM();
        d = R.modulus();
    }
    d = d <= fd ? fd : d;

    const resultAffinity = !affinityB
        ? sign(affinityA) * affinityA ** 2
        : affinityA * affinityB;
    const coefficient =
        Math.abs(resultAffinity) *
        a *
        (sign(resultAffinity) * (a1 / Math.abs(d - ed - sd)) ** m -
            (a2 / Math.abs(d - ed - sd)) ** n);
    // const coefficient = resultAffinity / d;

    return R.multiply(coefficient);
}

export default getForce;
