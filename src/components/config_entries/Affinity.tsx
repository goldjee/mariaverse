import React from 'react';
import { observer } from 'mobx-react-lite';
import { Group, NumberInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useStore } from '../../stores/stores';
import ConfigEntry from './ConfigEntry';
import ConcreteConfigEntryProps from './ConcreteConfigEntryProps';

const Affinity: React.FC<ConcreteConfigEntryProps> = ({ onChange }) => {
    const { t } = useTranslation();
    const {
        universeStore: {
            config: { affinityMax, affinityMin },
        },
    } = useStore();

    return (
        <ConfigEntry label={t('affinity')}>
            <Group position='left' grow>
                <NumberInput
                    label={t('min')}
                    min={-100}
                    max={affinityMax}
                    value={affinityMin}
                    step={10}
                    precision={1}
                    onChange={(value) => onChange(value, 'affinityMin')}
                    w='50%'
                />
                <NumberInput
                    label={t('max')}
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
