import React from 'react';
import { AppShell, Center, Grid, Header, Title } from '@mantine/core';
import Mariaverse from './components/Mariaverse';
import ConfigPanel from './components/ConfigPanel';
import { StoreContext, stores } from './stores/stores';

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
                        <Center h="100%">
                            <Mariaverse />
                        </Center>
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
