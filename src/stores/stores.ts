import React from 'react';

import SpaceStore from './SpaceStore';

export const stores = {
    spaceStore: new SpaceStore(),
};

export const StoreContext = React.createContext(stores);

export const useStore = () => React.useContext(StoreContext);