import React from 'react';
import { AppShell, Center, Header, Title } from '@mantine/core';
import Mariaverse from './components/Mariaverse';

const App: React.FC = () => {
    return (
        <AppShell
            padding="md"
            header={
                <Header height={60} p="xs">
                    <Title>Mariaverse</Title>
                </Header>
            }
        >
            <Center w="100%" h="90%">
                <Mariaverse />
            </Center>
        </AppShell>
    );
};

export default App;
