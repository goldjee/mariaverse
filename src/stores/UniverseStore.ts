import { makeAutoObservable } from 'mobx';
import { ParticleProperties, ParticleType } from '../engine/Particle';
import Universe from '../engine/Universe';
import { DEFAULT_CONFIG, Config } from '../engine/Config';

class UniverseStore {
    public universe: Universe;

    constructor() {
        const config = this.loadConfig();
        this.universe = makeAutoObservable(new Universe(config));
        this.saveConfig(config);
        makeAutoObservable(this, {}, { autoBind: true });
    }

    private loadConfig(): Config {
        const configString = localStorage.getItem('config');
        if (!configString) return DEFAULT_CONFIG;

        return JSON.parse(configString);
    }

    private saveConfig(config: Config): void {
        localStorage.setItem('config', JSON.stringify(config));
    }

    public setConfig(config?: Config): void {
        config = config || DEFAULT_CONFIG;
        this.universe.config = config;
        this.saveConfig(config);
    }

    public get config(): Config {
        return this.universe.config;
    }

    public get particleProperties(): Map<ParticleType, ParticleProperties> {
        return this.universe.particlesProperties;
    }

    public setParticleProperties(): void {
        this.universe.setParticlesProperties();
    }

    public repopulate(): void {
        this.universe.repopulate();
    }
}

export default UniverseStore;
