import { Box, Flex, FlexProps, Text } from '@mantine/core';
import React, { ReactNode } from 'react';

interface Props {
    label: string;
    children: ReactNode;
}

const ConfigEntry: React.FC<Props & FlexProps> = ({ label, children, ...rest }) => {
    return (
        <Flex w={rest.w || '100%'} direction="row" justify="flex-start" align="flex-start">
            <Text w="40%">{label}</Text>
            <Box w="60%">
                {children}
            </Box>
        </Flex>
    );
};

export default ConfigEntry;
