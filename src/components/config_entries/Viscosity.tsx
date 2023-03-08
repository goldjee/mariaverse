import React from 'react';
import { observer } from 'mobx-react-lite';
import { Slider } from '@mantine/core';

import { useStore } from '../../stores/stores';
import ConfigEntry from './ConfigEntry';
import ConcreteConfigEntryProps from './ConcreteConfigEntryProps';
import { useTranslation } from 'react-i18next';

const Viscosity: React.FC<ConcreteConfigEntryProps> = ({ onChange }) => {
    const { t } = useTranslation();
    const {
        universeStore: {
            config: { viscosity },
        },
    } = useStore();

    return (
        <ConfigEntry label={t('viscosity')}>
            <Slider
                step={1e-1}
                min={1e-9}
                max={1}
                value={
                    viscosity === 1e-9
                        ? viscosity
                        : Number.parseFloat(viscosity.toFixed(1))
                }
                onChange={(value) => onChange(value, 'viscosity')}
            />
        </ConfigEntry>
    );
};

export default observer(Viscosity);
