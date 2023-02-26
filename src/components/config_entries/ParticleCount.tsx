import React from 'react';
import { observer } from 'mobx-react-lite';
import { Group, NumberInput } from '@mantine/core';

import { useStore } from '../../stores/stores';
import ConfigEntry from './ConfigEntry';
import ConcreteConfigEntryProps from './ConcreteConfigEntryProps';

const ParticleCount: React.FC<ConcreteConfigEntryProps> = ({ onChange }) => {
    const {
        universeStore: {
            config: { particleCountMax, particleCountMin },
        },
    } = useStore();

    return (
        <ConfigEntry label='Количество частиц'>
            <Group position='left' grow>
                <NumberInput
                    label='мин'
                    min={0}
                    max={particleCountMax}
                    value={particleCountMin}
                    step={1}
                    onChange={(value) => onChange(value, 'particleCountMin')}
                    w='50%'
                />
                <NumberInput
                    label='макс'
                    min={particleCountMin}
                    max={2000}
                    value={particleCountMax}
                    step={1}
                    onChange={(value) => onChange(value, 'particleCountMax')}
                    w='50%'
                />
            </Group>
        </ConfigEntry>
    );
};

export default observer(ParticleCount);
