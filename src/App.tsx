import React from 'react';
import { observer } from 'mobx-react-lite';
import {
    AppShell,
    Group,
    Header,
    Stack,
    Title,
    Image,
    Highlight,
} from '@mantine/core';

import Mariaverse from './components/Mariaverse';
import ConfigPanel from './components/config/ConfigPanel';
import About from './components/About';
import logo from './logo.svg';
import AppVersion from './components/AppVersion';

const App: React.FC = () => {
    return (
        <AppShell
            padding='md'
            header={
                <Header height={60} p='xs'>
                    <Group position='apart' w='100%'>
                        <Group spacing='xs'>
                            <Image src={logo} width={40} />
                            <Group spacing='xs' align='baseline'>
                                <Title>Mariaverse</Title>
                                <AppVersion />
                            </Group>
                        </Group>
                        <ConfigPanel />
                    </Group>
                </Header>
            }
        >
            <Stack w='100%'>
                <Title order={3}>
                    <Highlight
                        highlight={['Mariaverse']}
                        highlightStyles={{ background: 'none' }}
                        variant='gradient'
                    >
                        Mariaverse - это удивительный в своей простоте симулятор
                        маленькой вселенной
                    </Highlight>
                </Title>
                <Mariaverse />
                <About />
            </Stack>
        </AppShell>
    );
};

export default observer(App);
