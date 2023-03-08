import React from 'react';
import { observer } from 'mobx-react-lite';
import { Group, NumberInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useStore } from '../../stores/stores';
import ConfigEntry from './ConfigEntry';
import ConcreteConfigEntryProps from './ConcreteConfigEntryProps';

const ParticleCount: React.FC<ConcreteConfigEntryProps> = ({ onChange }) => {
    const { t } = useTranslation();
    const {
        universeStore: {
            config: { particleCountMax, particleCountMin },
        },
    } = useStore();

    return (
        <ConfigEntry label={t('particle_count')}>
            <Group position='left' grow>
                <NumberInput
                    label={t('min')}
                    min={0}
                    max={particleCountMax}
                    value={particleCountMin}
                    step={1}
                    onChange={(value) => onChange(value, 'particleCountMin')}
                    w='50%'
                />
                <NumberInput
                    label={t('max')}
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
