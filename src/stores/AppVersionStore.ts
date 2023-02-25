import { makeAutoObservable } from 'mobx';

class AppVersionStore {
    private _appHash: string;
    private _appVersion: string;

    public get appHash(): string {
        return this._appHash;
    }
    public get appVersion(): string {
        return this._appVersion;
    }

    constructor() {
        this._appHash = import.meta.env.VITE_HASH || 'unknown_commit';
        const savedAppHash = this.loadAppInfoParameter('app_hash');

        this._appVersion = import.meta.env.VITE_VERSION || 'dev';
        const savedAppVersion = this.loadAppInfoParameter('app_version');

        if (
            savedAppHash !== this.appHash ||
            savedAppVersion !== this.appVersion
        ) {
            localStorage.clear();
            localStorage.setItem('app_hash', JSON.stringify(this.appHash));
            localStorage.setItem(
                'app_version',
                JSON.stringify(this.appVersion)
            );
        }

        makeAutoObservable(this);
    }

    private loadAppInfoParameter(
        key: 'app_hash' | 'app_version'
    ): string | undefined {
        const parameter = localStorage.getItem(key);
        if (!parameter) return undefined;

        return JSON.parse(parameter);
    }
}

export default AppVersionStore;
