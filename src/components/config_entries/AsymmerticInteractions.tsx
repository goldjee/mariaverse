import React from 'react';
import { observer } from 'mobx-react-lite';
import { Switch } from '@mantine/core';

import { useStore } from '../../stores/stores';
import ConfigEntry from './ConfigEntry';
import ConcreteConfigEntryProps from './ConcreteConfigEntryProps';

const AsymmerticInteractions: React.FC<ConcreteConfigEntryProps> = ({
    onChange,
}) => {
    const {
        universeStore: {
            config: { hasAsymmetricInteractions },
        },
    } = useStore();

    return (
        <ConfigEntry label='Асимметричные взаимодействия'>
            <Switch
                checked={hasAsymmetricInteractions}
                onChange={(e) =>
                    onChange(
                        e.currentTarget.checked,
                        'hasAsymmetricInteractions'
                    )
                }
            />
        </ConfigEntry>
    );
};

export default observer(AsymmerticInteractions);
