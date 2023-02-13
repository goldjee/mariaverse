import { makeAutoObservable } from 'mobx';
import Space from '../engine/Space';
import { SpaceConfig } from '../engine/SpaceConfig';

class SpaceStore {
    public space: Space;

    constructor() {
        this.space = new Space();
        makeAutoObservable(this);
    }

    public setConfig(config: SpaceConfig): void {
        this.space.setConfig(config);
    }

    public getConfig(): SpaceConfig {
        return this.space.getConfig();
    }
}

export default SpaceStore;