import React, { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Grid, Text } from '@mantine/core';

interface Props {
    label: React.ReactNode | string;
    children: ReactNode;
}

const ConfigEntry: React.FC<Props> = ({ label, children }) => {
    return (
        <Grid grow align='center'>
            <Grid.Col sm={5} xs={12}>
                {React.isValidElement(label) ? (
                    label
                ) : (
                    <Text w='100%'>{label}</Text>
                )}
            </Grid.Col>
            <Grid.Col sm={7} xs={12}>
                <Box>{children}</Box>
            </Grid.Col>
        </Grid>
    );
};

export default observer(ConfigEntry);
