import React from 'react';

import UniverseStore from './UniverseStore';

export const stores = {
    universeStore: new UniverseStore(),
};

export const StoreContext = React.createContext(stores);

export const useStore = () => React.useContext(StoreContext);