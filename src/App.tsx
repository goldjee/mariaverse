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
import { StoreContext, stores } from './stores/stores';
import About from './components/About';
import logo from './logo.svg';

const App: React.FC = () => {
    return (
        <StoreContext.Provider value={stores}>
            <AppShell
                padding="md"
                header={
                    <Header height={60} p="xs">
                        <Group spacing="xs">
                            <Image src={logo} width={40} />
                            <Title>Mariaverse</Title>
                        </Group>
                    </Header>
                }
            >
                <Grid h="100%">
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
        </StoreContext.Provider>
    );
};

export default App;
