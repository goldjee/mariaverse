import React from 'react';
import { observer } from 'mobx-react-lite';
import { Group, NumberInput } from '@mantine/core';

import { useStore } from '../../stores/stores';
import ConfigEntry from './ConfigEntry';
import ConcreteConfigEntryProps from './ConcreteConfigEntryProps';

const Affinity: React.FC<ConcreteConfigEntryProps> = ({ onChange }) => {
    const {
        universeStore: {
            config: { affinityMax, affinityMin },
        },
    } = useStore();

    return (
        <ConfigEntry label='Тяга к соседям'>
            <Group position='left' grow>
                <NumberInput
                    label='мин'
                    min={-100}
                    max={affinityMax}
                    value={affinityMin}
                    step={10}
                    precision={1}
                    onChange={(value) => onChange(value, 'affinityMin')}
                    w='50%'
                />
                <NumberInput
                    label='макс'
                    min={affinityMin}
                    max={100}
                    value={affinityMax}
                    step={10}
                    precision={1}
                    onChange={(value) => onChange(value, 'affinityMax')}
                    w='50%'
                />
            </Group>
        </ConfigEntry>
    );
};

export default observer(Affinity);
