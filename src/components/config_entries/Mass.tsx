import React from 'react';
import { observer } from 'mobx-react-lite';
import { Group, NumberInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useStore } from '../../stores/stores';
import ConfigEntry from './ConfigEntry';
import ConcreteConfigEntryProps from './ConcreteConfigEntryProps';

const Mass: React.FC<ConcreteConfigEntryProps> = ({ onChange }) => {
    const { t } = useTranslation();
    const {
        universeStore: {
            config: { massMax, massMin },
        },
    } = useStore();

    return (
        <ConfigEntry label={t('mass')}>
            <Group position='left' grow>
                <NumberInput
                    label={t('min')}
                    min={0}
                    max={massMax}
                    value={massMin}
                    step={0.1}
                    precision={1}
                    onChange={(value) => onChange(value, 'massMin')}
                    w='50%'
                />
                <NumberInput
                    label={t('max')}
                    min={massMin}
                    max={2}
                    value={massMax}
                    step={0.1}
                    precision={1}
                    onChange={(value) => onChange(value, 'massMax')}
                    w='50%'
                />
            </Group>
        </ConfigEntry>
    );
};

export default observer(Mass);
