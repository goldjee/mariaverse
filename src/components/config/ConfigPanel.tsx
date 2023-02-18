import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
    NumberInput,
    Slider,
    Stack,
    Switch,
    Title,
    Text,
    Card,
    Group,
    ActionIcon,
    Tooltip,
} from '@mantine/core';
import { BsArrowClockwise, BsWind, BsArrowLeftRight } from 'react-icons/bs';
import { GiWeight } from 'react-icons/gi';
import { DEFAULT_CONFIG, Config } from '../../engine/Config';
import ConfigEntry from './ConfigEntry';
import { useStore } from '../../stores/stores';
import Circle from '../Circle';

const ConfigPanel: React.FC = observer(() => {
    const { universeStore: spaceStore } = useStore();
    const [config, setConfig] = useState<Config>(
        spaceStore.getConfig() || DEFAULT_CONFIG
    );
    const [particleProperties, setParticleProperties] = useState(
        spaceStore.getParticleProperties()
    );

    const onChange = useCallback(
        (value: number | boolean | undefined, key: string) => {
            if (key in config) {
                setConfig((prev) => {
                    const newConfig = {
                        ...prev,
                        ...{ [key]: value },
                    } as Config;
                    spaceStore.setConfig(newConfig);
                    return newConfig;
                });
            }
        },
        [config, spaceStore]
    );

    const reset = useCallback(() => {
        spaceStore.setConfig();
        setConfig(spaceStore.getConfig());
        spaceStore.recreateParticleProperties();
        spaceStore.repopulate();
    }, [spaceStore]);

    const recreateParticleProperties = useCallback(() => {
        spaceStore.recreateParticleProperties();
        setParticleProperties(spaceStore.getParticleProperties());
    }, [spaceStore]);

    const repopulate = useCallback(() => {
        spaceStore.recreateParticleProperties();
        spaceStore.repopulate();
    }, [spaceStore]);

    useEffect(() => {
        spaceStore.universe.setConfig(config);
    }, [config, spaceStore]);

    return (
        <Stack align="flex-start" justify="flex-start">
            <Card w="100%">
                <Stack>
                    <Group position="apart">
                        <Title order={5}>Свойства вселенной</Title>
                        <Tooltip label="Сбросить настройки">
                            <ActionIcon
                                onClick={reset}
                                color="red"
                                variant="outline"
                            >
                                <BsArrowClockwise />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                    <ConfigEntry label="Скорость света">
                        <NumberInput
                            min={0}
                            value={config.velocityCap}
                            step={100}
                            onChange={(value) => onChange(value, 'velocityCap')}
                        />
                    </ConfigEntry>
                    <ConfigEntry label="Предел дальнодействия">
                        <NumberInput
                            min={400}
                            value={config.forceDistanceCap}
                            step={50}
                            onChange={(value) =>
                                onChange(value, 'forceDistanceCap')
                            }
                        />
                    </ConfigEntry>
                    <ConfigEntry label="Асимметричные взаимодействия">
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
                    <ConfigEntry label="Вязкость среды">
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

            <Card w="100%">
                <Stack>
                    <Group position="apart">
                        <Title order={5}>Частицы</Title>
                        <Tooltip label="Пересоздать">
                            <ActionIcon
                                onClick={repopulate}
                                color="blue"
                                variant="filled"
                            >
                                <BsWind />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                    <ConfigEntry label="Количество частиц">
                        <Group position="left" grow>
                            <NumberInput
                                label="мин"
                                min={0}
                                max={config.particleCountMax}
                                value={config.particleCountMin}
                                step={1}
                                onChange={(value) =>
                                    onChange(value, 'particleCountMin')
                                }
                                w="50%"
                            />
                            <NumberInput
                                label="макс"
                                min={config.particleCountMin}
                                max={2000}
                                value={config.particleCountMax}
                                step={1}
                                onChange={(value) =>
                                    onChange(value, 'particleCountMax')
                                }
                                w="50%"
                            />
                        </Group>
                    </ConfigEntry>
                    <ConfigEntry label="Масса частицы">
                        <Group position="left" grow>
                            <NumberInput
                                label="мин"
                                min={0}
                                max={config.massMax}
                                value={config.massMin}
                                step={0.1}
                                precision={1}
                                onChange={(value) => onChange(value, 'massMin')}
                                w="50%"
                            />
                            <NumberInput
                                label="макс"
                                min={config.massMin}
                                max={2}
                                value={config.massMax}
                                step={0.1}
                                precision={1}
                                onChange={(value) => onChange(value, 'massMax')}
                                w="50%"
                            />
                        </Group>
                    </ConfigEntry>
                    <ConfigEntry label="Тяга к соседям">
                        <Group position="left" grow>
                            <NumberInput
                                label="мин"
                                min={-100}
                                max={config.affinityMax}
                                value={config.affinityMin}
                                step={10}
                                precision={1}
                                onChange={(value) =>
                                    onChange(value, 'affinityMin')
                                }
                                w="50%"
                            />
                            <NumberInput
                                label="макс"
                                min={config.affinityMin}
                                max={100}
                                value={config.affinityMax}
                                step={10}
                                precision={1}
                                onChange={(value) =>
                                    onChange(value, 'affinityMax')
                                }
                                w="50%"
                            />
                        </Group>
                    </ConfigEntry>
                </Stack>
            </Card>

            <Card w="100%">
                <Stack>
                    <Group position="apart">
                        <Title order={5}>Свойства частиц</Title>
                        <Tooltip label="Сгенерировать новые">
                            <ActionIcon
                                onClick={recreateParticleProperties}
                                color="blue"
                                variant="filled"
                            >
                                <BsArrowLeftRight />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                    {particleProperties.map((properties) => (
                        <Stack key={properties.type} spacing="xs">
                            <ConfigEntry
                                label={
                                    <Title order={6} color={properties.type}>
                                        <Group spacing="sm">
                                            <GiWeight />
                                            {properties.type}
                                        </Group>
                                    </Title>
                                }
                            >
                                <Text>{properties.mass.toFixed(6)}</Text>
                            </ConfigEntry>
                            {properties.affinities.map((affinity) => (
                                <ConfigEntry
                                    label={
                                        <Group spacing="sm">
                                            <Circle color={properties.type} />
                                            <Text>→</Text>
                                            <Circle color={affinity.type} />
                                        </Group>
                                    }
                                    key={`${properties.type} -> ${affinity.type}`}
                                >
                                    <Text>{affinity.affinity.toFixed(6)}</Text>
                                </ConfigEntry>
                            ))}
                        </Stack>
                    ))}
                </Stack>
            </Card>
        </Stack>
    );
});

export default ConfigPanel;
