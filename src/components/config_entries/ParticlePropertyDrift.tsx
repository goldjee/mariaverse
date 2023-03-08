import React from 'react';
import { observer } from 'mobx-react-lite';
import { Group, NumberInput, Switch } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useStore } from '../../stores/stores';
import ConfigEntry from './ConfigEntry';
import ConcreteConfigEntryProps from './ConcreteConfigEntryProps';
import { DEFAULT_CONFIG } from '../../engine/Config';

const ParticlePropertyDrift: React.FC<ConcreteConfigEntryProps> = ({
    onChange,
}) => {
    const { t } = useTranslation();
    const {
        universeStore: {
            config: { driftPeriod },
        },
    } = useStore();

    return (
        <ConfigEntry label={t('drift_period')}>
            <Group position='left' grow>
                <Switch
                    checked={!!driftPeriod && driftPeriod !== 0}
                    onChange={(e) =>
                        onChange(
                            e.currentTarget.checked
                                ? DEFAULT_CONFIG.driftPeriod || 20 * 1000
                                : 0,
                            'driftPeriod'
                        )
                    }
                />
                {!!driftPeriod && driftPeriod !== 0 && (
                    <NumberInput
                        min={0}
                        value={driftPeriod / 1000}
                        step={1}
                        onChange={(value) =>
                            onChange((value || 0) * 1000, 'driftPeriod')
                        }
                    />
                )}
            </Group>
        </ConfigEntry>
    );
};

export default observer(ParticlePropertyDrift);
