import { makeAutoObservable } from 'mobx';
import { ParticleProperties } from '../engine/Particle';
import Space from '../engine/Space';
import { DEFAULT_CONFIG, SpaceConfig } from '../engine/SpaceConfig';

class SpaceStore {
    public space: Space;

    constructor() {
        const config = this.loadConfig();
        this.space = new Space(config);
        this.saveConfig(config);
        makeAutoObservable(this);
    }

    private loadConfig(): SpaceConfig {
        const configString = localStorage.getItem('config');
        if (!configString) return DEFAULT_CONFIG;

        return JSON.parse(configString);
    }

    private saveConfig(config: SpaceConfig): void {
        localStorage.setItem('config', JSON.stringify(config));
    }

    public setConfig(config?: SpaceConfig): void {
        config = config || DEFAULT_CONFIG;
        this.space.setConfig(config);
        this.saveConfig(config);
    }

    public getConfig(): SpaceConfig {
        return this.space.getConfig();
    }

    public getParticleProperties(): ParticleProperties[] {
        return this.space.getParticleProperties();
    }

    public recreateParticleProperties(): void {
        this.space.recreateParticleProperties();
    }

    public repopulate(): void {
        this.space.repopulate();
    }
}

export default SpaceStore;
