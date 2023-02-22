import React from 'react';

import AppVersionStore from './AppVersionStore';
import UniverseStore from './UniverseStore';

export const stores = {
    appVersionStore: new AppVersionStore(),
    universeStore: new UniverseStore(),
};

export const StoreContext = React.createContext(stores);

export const useStore = () => React.useContext(StoreContext);