import { makeAutoObservable } from 'mobx';
import GitInfo from 'react-git-info/macro';

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
        const gitInfo = GitInfo();
        this._appHash = gitInfo.commit.shortHash;
        const savedAppHash = this.loadAppInfoParameter('app_hash');

        this._appVersion = process.env.REACT_APP_VERSION || 'dev';
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
