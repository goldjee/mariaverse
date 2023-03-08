import React from 'react';
import { observer } from 'mobx-react-lite';
import { Group, Text } from '@mantine/core';

import { ParticleType } from '../../../engine/Particle';
import Circle from './Circle';
import ConfigEntry from '../../config_entries/ConfigEntry';

interface Props {
    typeA: ParticleType;
    typeB: ParticleType;
    affinity: number;
}

const AffinityView: React.FC<Props> = ({ typeA, typeB, affinity }) => {
    return (
        <ConfigEntry
            label={
                <Group spacing='sm'>
                    <Circle color={typeA} />
                    <Text>{affinity >= 0 ? '→' : '←'}</Text>
                    <Circle color={typeB} />
                </Group>
            }
            key={`${typeA} -> ${typeB}`}
        >
            <Text>{affinity.toFixed(6)}</Text>
        </ConfigEntry>
    );
};

export default observer(AffinityView);
