import React from 'react';
import { observer } from 'mobx-react-lite';
import { Switch } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useStore } from '../../stores/stores';
import ConfigEntry from './ConfigEntry';
import ConcreteConfigEntryProps from './ConcreteConfigEntryProps';

const AsymmerticInteractions: React.FC<ConcreteConfigEntryProps> = ({
    onChange,
}) => {
    const { t } = useTranslation();
    const {
        universeStore: {
            config: { hasAsymmetricInteractions },
        },
    } = useStore();

    return (
        <ConfigEntry label={t('asymmetric')}>
            <Switch
                checked={hasAsymmetricInteractions}
                onChange={(e) =>
                    onChange(
                        e.currentTarget.checked,
                        'hasAsymmetricInteractions'
                    )
                }
            />
        </ConfigEntry>
    );
};

export default observer(AsymmerticInteractions);
