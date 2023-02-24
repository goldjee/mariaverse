import React, { ReactNode } from 'react';
import { Box, Grid, Text } from '@mantine/core';

interface Props {
    label: React.ReactNode | string;
    children: ReactNode;
}

const ConfigEntry: React.FC<Props> = ({ label, children }) => {
    return (
        <Grid grow align='center'>
            <Grid.Col span={5}>
                {React.isValidElement(label) ? (
                    label
                ) : (
                    <Text w='40%'>{label}</Text>
                )}
            </Grid.Col>
            <Grid.Col span={7}>
                <Box>{children}</Box>
            </Grid.Col>
        </Grid>
    );
};

export default ConfigEntry;
