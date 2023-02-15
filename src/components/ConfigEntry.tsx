import { Box, FlexProps, Group, Text } from '@mantine/core';
import React, { ReactNode } from 'react';

interface Props {
    label?: string;
    icon?: React.ReactNode;
    children: ReactNode;
}

const ConfigEntry: React.FC<Props & FlexProps> = ({
    label,
    icon,
    children,
    ...rest
}) => {
    return (
        <Group w={rest.w || '100%'} position="apart" grow>
            {(label || icon) && (
                <Group spacing="sm">
                    {icon}
                    {label && <Text w="40%">{label}</Text>}
                </Group>
            )}
            <Box w="60%">{children}</Box>
        </Group>
    );
};

export default ConfigEntry;
