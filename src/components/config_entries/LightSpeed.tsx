import React from 'react';
import { observer } from 'mobx-react-lite';
import { NumberInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useStore } from '../../stores/stores';
import ConfigEntry from './ConfigEntry';
import ConcreteConfigEntryProps from './ConcreteConfigEntryProps';

const LightSpeed: React.FC<ConcreteConfigEntryProps> = ({ onChange }) => {
    const { t } = useTranslation();
    const {
        universeStore: {
            config: { velocityCap },
        },
    } = useStore();

    return (
        <ConfigEntry label={t('velocity_cap')}>
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
