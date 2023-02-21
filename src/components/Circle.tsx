import { Box, BoxProps } from '@mantine/core';
import React from 'react';

interface Props extends BoxProps {
    color: string;
}

const Circle: React.FC<Props> = ({ color, ...rest }) => {
    return (
        <Box
            w="0.5rem"
            h="0.5rem"
            bg={color}
            sx={{
                borderRadius: '0.5rem',
            }}
            {...rest}
        />
    );
};

export default Circle;