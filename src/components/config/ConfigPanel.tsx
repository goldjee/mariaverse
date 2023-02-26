import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';
import {
    Stack,
    Title,
    Card,
    Group,
    ActionIcon,
    Tooltip,
    Drawer,
    ScrollArea,
} from '@mantine/core';
import {
    BsArrowClockwise,
    BsWind,
    BsArrowLeftRight,
    BsFillGearFill,
} from 'react-icons/bs';

import { Config } from '../../engine/Config';
import { useStore } from '../../stores/stores';
import ParticlePropertiesView from './particle/ParticlePropertiesView';
import LightSpeed from '../config_entries/LightSpeed';
import DistanceCap from '../config_entries/DistanceCap';
import AsymmerticInteractions from '../config_entries/AsymmerticInteractions';
import Viscosity from '../config_entries/Viscosity';
import ParticleCount from '../config_entries/ParticleCount';
import Mass from '../config_entries/Mass';
import Affinity from '../config_entries/Affinity';
import ParticlePropertyDrift from '../config_entries/ParticlePropertyDrift';

const ConfigPanel: React.FC = () => {
    const [opened, setOpened] = useState(false);
    const {
        universeStore: {
            config,
            setConfig,
            particleProperties,
            setParticleProperties,
            repopulate,
        },
    } = useStore();

    const particlePropertiesViews: ReactNode[] = useMemo(
        () =>
            computed((): ReactNode[] => {
                const p: ReactNode[] = [];
                particleProperties.forEach((properties, type) => {
                    p.push(
                        <ParticlePropertiesView
                            key={type}
                            type={type}
                            mass={properties.mass}
                            affinities={properties.affinities}
                        />
                    );
                });
                return p;
            }),
        [particleProperties]
    ).get();

    const onChange = useCallback(
        (value: number | boolean | undefined, key: string) => {
            if (key in config) {
                setConfig({
                    ...config,
                    ...{ [key]: value },
                } as Config);
            }
        },
        [config, setConfig]
    );

    const reset = useCallback(() => {
        setConfig();
        setConfig();
        setParticleProperties();
        repopulate();
    }, [repopulate, setConfig, setParticleProperties]);

    const resetParticleProperties = useCallback(() => {
        setParticleProperties();
    }, [setParticleProperties]);

    const resetParticles = useCallback(() => {
        setParticleProperties();
        repopulate();
    }, [repopulate, setParticleProperties]);

    return (
        <>
            <Tooltip label='Настройки симуляции'>
                <ActionIcon
                    onClick={() => setOpened(true)}
                    color='blue'
                    variant='filled'
                >
                    <BsFillGearFill />
                </ActionIcon>
            </Tooltip>
            <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                title='Настройки симуляции'
                padding='xl'
                size='xl'
                position='right'
            >
                <ScrollArea style={{ height: '87vh' }}>
                    <Stack align='flex-start' justify='flex-start'>
                        <Card w='100%'>
                            <Stack>
                                <Group position='apart'>
                                    <Title order={5}>Свойства вселенной</Title>
                                    <Tooltip label='Сбросить настройки'>
                                        <ActionIcon
                                            onClick={reset}
                                            color='red'
                                            variant='outline'
                                        >
                                            <BsArrowClockwise />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                                <LightSpeed onChange={onChange} />
                                <DistanceCap onChange={onChange} />
                                <AsymmerticInteractions onChange={onChange} />
                                <Viscosity onChange={onChange} />
                            </Stack>
                        </Card>

                        <Card w='100%'>
                            <Stack>
                                <Group position='apart'>
                                    <Title order={5}>Частицы</Title>
                                    <Tooltip label='Пересоздать'>
                                        <ActionIcon
                                            onClick={resetParticles}
                                            color='blue'
                                            variant='filled'
                                        >
                                            <BsWind />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                                <ParticleCount onChange={onChange} />
                                <Mass onChange={onChange} />
                                <Affinity onChange={onChange} />
                                <ParticlePropertyDrift onChange={onChange} />
                            </Stack>
                        </Card>

                        <Card w='100%'>
                            <Stack>
                                <Group position='apart'>
                                    <Title order={5}>Свойства частиц</Title>
                                    <Tooltip label='Сгенерировать новые'>
                                        <ActionIcon
                                            onClick={resetParticleProperties}
                                            color='blue'
                                            variant='filled'
                                        >
                                            <BsArrowLeftRight />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                                {particlePropertiesViews}
                            </Stack>
                        </Card>
                    </Stack>
                </ScrollArea>
            </Drawer>
        </>
    );
};

export default observer(ConfigPanel);
