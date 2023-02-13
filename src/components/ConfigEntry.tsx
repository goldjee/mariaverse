import { Box, FlexProps, Group, Text } from '@mantine/core';
import React, { ReactNode } from 'react';

interface Props {
    label: string;
    children: ReactNode;
}

const ConfigEntry: React.FC<Props & FlexProps> = ({
    label,
    children,
    ...rest
}) => {
    return (
        <Group w={rest.w || '100%'} position="apart" grow>
            <Text w="40%">{label}</Text>
            <Box w="60%">{children}</Box>
        </Group>
    );
};

export default ConfigEntry;
