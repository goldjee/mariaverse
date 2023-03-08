import React from 'react';
import { observer } from 'mobx-react-lite';
import { Anchor, Card, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Card>
            <Stack>
                <Text>
                    {t('about_p1') + ' '}
                    <Anchor
                        href='https://www.youtube.com/watch?v=0Kx4Y9TVMGg'
                        target='_blank'
                    >
                        {t('about_p2')}
                    </Anchor>
                    . {t('about_p3')}
                </Text>
                <Text>{t('about_p4')}</Text>
            </Stack>
        </Card>
    );
};

export default observer(About);
