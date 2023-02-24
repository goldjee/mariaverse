import React from 'react';
import {
    AppShell,
    Grid,
    Group,
    Header,
    Stack,
    Title,
    Image,
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
                    <Group spacing='xs'>
                        <Image src={logo} width={40} />
                        <Group spacing='xs' align='baseline'>
                            <Title>Mariaverse</Title>
                            <AppVersion />
                        </Group>
                    </Group>
                </Header>
            }
        >
            <Grid h='100%'>
                <Grid.Col lg={8} md={12}>
                    <Stack>
                        <Mariaverse />
                        <About />
                    </Stack>
                </Grid.Col>
                <Grid.Col lg={4} md={12}>
                    <ConfigPanel />
                </Grid.Col>
            </Grid>
        </AppShell>
    );
};

export default App;
