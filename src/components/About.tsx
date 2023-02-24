import React from 'react';
import { Anchor, Card, Highlight, Stack, Text } from '@mantine/core';

const About: React.FC = () => {
    return (
        <Card>
            <Stack>
                <Text>
                    Как-то летом я серфил Youtube и наткнулся на очень занятное{' '}
                    <Anchor
                        href='https://www.youtube.com/watch?v=0Kx4Y9TVMGg'
                        target='_blank'
                    >
                        видео
                    </Anchor>
                    . Автор поделился необычной идеей, которую я долгое время
                    хотел реализовать. Спасибо, Brainxyz.
                </Text>
                <Highlight
                    highlight={['Mariaverse']}
                    highlightStyles={{ background: 'none' }}
                    weight='bolder'
                    variant='gradient'
                >
                    Mariaverse - это удивительный в своей простоте симулятор
                    маленькой вселенной.
                </Highlight>
                <Text>
                    Ее населяют маленькие частички разных цветов. Цвета
                    относятся друг к другу по-разному. Одному цвету может
                    нравиться другой, и тогда он будет к нему притягиваться. А
                    может быть и наоборот. Частички кружатся в вальсе этих
                    простых взаимодействий, и образуют необычные движущиеся
                    картины, очень похожие на живые существа.
                </Text>
                <Text>
                    С днем Святого Валентина, Маша! Я создал для тебя живую
                    вселенную.
                </Text>
            </Stack>
        </Card>
    );
};

export default About;
