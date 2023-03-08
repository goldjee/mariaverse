import React from 'react';
import { observer } from 'mobx-react-lite';
import { NumberInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useStore } from '../../stores/stores';
import ConfigEntry from './ConfigEntry';
import ConcreteConfigEntryProps from './ConcreteConfigEntryProps';

const DistanceCap: React.FC<ConcreteConfigEntryProps> = ({ onChange }) => {
    const { t } = useTranslation();
    const {
        universeStore: {
            config: { forceDistanceCap },
        },
    } = useStore();

    return (
        <ConfigEntry label={t('distance_cap')}>
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
