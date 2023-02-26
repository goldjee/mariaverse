import React from 'react';
import { observer } from 'mobx-react-lite';
import { NumberInput } from '@mantine/core';

import { useStore } from '../../stores/stores';
import ConfigEntry from './ConfigEntry';
import ConcreteConfigEntryProps from './ConcreteConfigEntryProps';

const DistanceCap: React.FC<ConcreteConfigEntryProps> = ({ onChange }) => {
    const {
        universeStore: {
            config: { forceDistanceCap },
        },
    } = useStore();

    return (
        <ConfigEntry label='Предел дальнодействия'>
            <NumberInput
                min={400}
                value={forceDistanceCap}
                step={50}
                onChange={(value) => onChange(value, 'forceDistanceCap')}
            />
        </ConfigEntry>
    );
};

export default observer(DistanceCap);
