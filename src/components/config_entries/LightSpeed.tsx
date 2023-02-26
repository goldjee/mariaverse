import React from 'react';
import { observer } from 'mobx-react-lite';
import { NumberInput } from '@mantine/core';

import { useStore } from '../../stores/stores';
import ConfigEntry from './ConfigEntry';
import ConcreteConfigEntryProps from './ConcreteConfigEntryProps';

const LightSpeed: React.FC<ConcreteConfigEntryProps> = ({ onChange }) => {
    const {
        universeStore: {
            config: { velocityCap },
        },
    } = useStore();

    return (
        <ConfigEntry label='Скорость света'>
            <NumberInput
                min={0}
                value={velocityCap}
                step={100}
                onChange={(value) => onChange(value, 'velocityCap')}
            />
        </ConfigEntry>
    );
};

export default observer(LightSpeed);
