import { makeAutoObservable } from 'mobx';
import { ParticleProperties } from '../engine/Particle';
import Universe from '../engine/Universe';
import { DEFAULT_CONFIG, Config } from '../engine/Config';

class SpaceStore {
    public universe: Universe;

    constructor() {
        const config = this.loadConfig();
        this.universe = new Universe(config);
        this.saveConfig(config);
        makeAutoObservable(this);
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

    public getConfig(): Config {
        return this.universe.config;
    }

    public getParticleProperties(): ParticleProperties[] {
        return this.universe.getParticleProperties();
    }

    public recreateParticleProperties(): void {
        this.universe.setParticleProperties();
    }

    public repopulate(): void {
        this.universe.repopulate();
    }
}

export default SpaceStore;
