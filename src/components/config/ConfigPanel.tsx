import React, { ReactNode, useCallback, useMemo } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';
import {
    NumberInput,
    Slider,
    Stack,
    Switch,
    Title,
    Card,
    Group,
    ActionIcon,
    Tooltip,
} from '@mantine/core';
import { BsArrowClockwise, BsWind, BsArrowLeftRight } from 'react-icons/bs';

import { Config } from '../../engine/Config';
import ConfigEntry from './ConfigEntry';
import { useStore } from '../../stores/stores';
import ParticlePropertiesView from './particle/ParticlePropertiesView';

const ConfigPanel: React.FC = () => {
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
                    <ConfigEntry label='Скорость света'>
                        <NumberInput
                            min={0}
                            value={config.velocityCap}
                            step={100}
                            onChange={(value) => onChange(value, 'velocityCap')}
                        />
                    </ConfigEntry>
                    <ConfigEntry label='Предел дальнодействия'>
                        <NumberInput
                            min={400}
                            value={config.forceDistanceCap}
                            step={50}
                            onChange={(value) =>
                                onChange(value, 'forceDistanceCap')
                            }
                        />
                    </ConfigEntry>
                    <ConfigEntry label='Асимметричные взаимодействия'>
                        <Switch
                            checked={config.hasAsymmetricInteractions}
                            onChange={(e) =>
                                onChange(
                                    e.currentTarget.checked,
                                    'hasAsymmetricInteractions'
                                )
                            }
                        />
                    </ConfigEntry>
                    <ConfigEntry label='Вязкость среды'>
                        <Slider
                            step={1e-1}
                            min={1e-9}
                            max={1}
                            value={
                                config.viscosity === 1e-9
                                    ? config.viscosity
                                    : Number.parseFloat(
                                          config.viscosity.toFixed(1)
                                      )
                            }
                            onChange={(value) => onChange(value, 'viscosity')}
                        />
                    </ConfigEntry>
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
                    <ConfigEntry label='Количество частиц'>
                        <Group position='left' grow>
                            <NumberInput
                                label='мин'
                                min={0}
                                max={config.particleCountMax}
                                value={config.particleCountMin}
                                step={1}
                                onChange={(value) =>
                                    onChange(value, 'particleCountMin')
                                }
                                w='50%'
                            />
                            <NumberInput
                                label='макс'
                                min={config.particleCountMin}
                                max={2000}
                                value={config.particleCountMax}
                                step={1}
                                onChange={(value) =>
                                    onChange(value, 'particleCountMax')
                                }
                                w='50%'
                            />
                        </Group>
                    </ConfigEntry>
                    <ConfigEntry label='Масса частицы'>
                        <Group position='left' grow>
                            <NumberInput
                                label='мин'
                                min={0}
                                max={config.massMax}
                                value={config.massMin}
                                step={0.1}
                                precision={1}
                                onChange={(value) => onChange(value, 'massMin')}
                                w='50%'
                            />
                            <NumberInput
                                label='макс'
                                min={config.massMin}
                                max={2}
                                value={config.massMax}
                                step={0.1}
                                precision={1}
                                onChange={(value) => onChange(value, 'massMax')}
                                w='50%'
                            />
                        </Group>
                    </ConfigEntry>
                    <ConfigEntry label='Тяга к соседям'>
                        <Group position='left' grow>
                            <NumberInput
                                label='мин'
                                min={-100}
                                max={config.affinityMax}
                                value={config.affinityMin}
                                step={10}
                                precision={1}
                                onChange={(value) =>
                                    onChange(value, 'affinityMin')
                                }
                                w='50%'
                            />
                            <NumberInput
                                label='макс'
                                min={config.affinityMin}
                                max={100}
                                value={config.affinityMax}
                                step={10}
                                precision={1}
                                onChange={(value) =>
                                    onChange(value, 'affinityMax')
                                }
                                w='50%'
                            />
                        </Group>
                    </ConfigEntry>
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
    );
};

export default observer(ConfigPanel);
