import React from 'react';
import { observer } from 'mobx-react-lite';
import { Text } from '@mantine/core';

import { useStore } from '../stores/stores';

const AppVersion: React.FC = () => {
    const { appVersionStore } = useStore();

    return <Text>v.{appVersionStore.appVersion}</Text>;
};

export default observer(AppVersion);
