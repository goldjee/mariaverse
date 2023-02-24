import React from 'react';

import AppVersionStore from './AppVersionStore';
import UniverseStore from './UniverseStore';

export const StoreContext = React.createContext({
    appVersionStore: new AppVersionStore(),
    universeStore: new UniverseStore(),
});

export const useStore = () => {
    const store = React.useContext(StoreContext);
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider.');
    }
    return store;
};
