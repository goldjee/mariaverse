import React, { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { Group, Stack, Text, Title } from '@mantine/core';
import { GiWeight } from 'react-icons/gi';

import { ParticleProperties, ParticleType } from '../../../engine/Particle';
import ConfigEntry from '../ConfigEntry';
import AffinityView from './AffinityView';

interface Props extends ParticleProperties {
    type: ParticleType;
}

const ParticlePropertiesView: React.FC<Props> = ({
    type,
    mass,
    affinities,
}) => {
    const affinityViews: ReactNode[] = [];
    affinities.forEach((affinity, counterpart) => {
        affinityViews.push(
            <AffinityView
                key={`${type} -> ${counterpart}`}
                typeA={type}
                typeB={counterpart}
                affinity={affinity}
            />
        );
    });

    return (
        <Stack spacing='xs'>
            <ConfigEntry
                label={
                    <Title order={6} color={type}>
                        <Group spacing='sm'>
                            <GiWeight />
                            {type}
                        </Group>
                    </Title>
                }
            >
                <Text>{mass.toFixed(6)}</Text>
            </ConfigEntry>
            {affinityViews}
        </Stack>
    );
};

export default observer(ParticlePropertiesView);
