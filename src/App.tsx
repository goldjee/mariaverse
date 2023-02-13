import React from 'react';
import { AppShell, Grid, Header, Stack, Title } from '@mantine/core';
import Mariaverse from './components/Mariaverse';
import ConfigPanel from './components/ConfigPanel';
import { StoreContext, stores } from './stores/stores';
import About from './components/About';

const App: React.FC = () => {
    return (
        <StoreContext.Provider value={stores}>
            <AppShell
                padding="md"
                header={
                    <Header height={60} p="xs">
                        <Title>Mariaverse</Title>
                    </Header>
                }
            >
                <Grid h="100%">
                    <Grid.Col span={8}>
                        <Stack h="100%">
                            <Mariaverse />
                            <About />
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <ConfigPanel />
                    </Grid.Col>
                </Grid>
            </AppShell>
        </StoreContext.Provider>
    );
};

export default App;
