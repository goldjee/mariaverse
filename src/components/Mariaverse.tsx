import React, { useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import { Particle } from '../engine/Particle';
import Vector from '../engine/Vector';
import { useStore } from '../stores/stores';

/*
    Thanks, good sir at https://javascript.plainenglish.io/smooth-animations-for-interactive-html-canvas-simulations-with-react-b6fc1109ecd7
    who made it all possible.
*/

const Mariaverse: React.FC = () => {
    const { universeStore } = useStore();
    const parent = useRef(null);
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });
    const [scale, setScale] = useState(1);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const lastRenderTimeRef = useRef<number>(Date.now());
    const animationFrameRequestRef = useRef<number | null>(null);
    const { t } = useTranslation();

    const setCanvasDimensions = useCallback(() => {
        if (parent.current) {
            const w = parent.current['offsetWidth'];
            // const h = parent.current['offsetHeight'];
            const scaleFactor = w / universeStore.config.sizeX;
            setScale(scaleFactor);
            setSize({
                width: universeStore.config.sizeX * scaleFactor,
                height: universeStore.config.sizeY * scaleFactor,
            });
        }
    }, [universeStore.config.sizeX, universeStore.config.sizeY]);

    const drawCircle = useCallback(
        (
            context: CanvasRenderingContext2D,
            position: Vector,
            radius: number,
            color: CanvasFillStrokeStyles['fillStyle']
        ): void => {
            context.beginPath();
            context.arc(
                position.x * scale,
                position.y * scale,
                Math.max(1, radius * scale),
                0,
                Math.PI * 2
            );
            context.fillStyle = color;
            context.fill();
        },
        [scale]
    );

    const drawParticle = useCallback(
        (context: CanvasRenderingContext2D, particle: Particle) => {
            drawCircle(
                context,
                particle.position,
                Math.abs(particle.mass * 5),
                particle.type
            );
        },
        [drawCircle]
    );

    const clearBackground = useCallback(
        (context: CanvasRenderingContext2D): void => {
            const { width, height } = context.canvas;
            context.rect(0, 0, width, height);
            context.fillStyle = 'black';
            context.fill();
        },
        []
    );

    const renderFrame = useCallback((): void => {
        const context = canvasRef.current?.getContext('2d');
        if (context != null) {
            const timeNow = Date.now();
            const deltaTime = timeNow - lastRenderTimeRef.current;

            void universeStore.update(deltaTime);

            // rendering
            clearBackground(context);
            const particles = universeStore.particles;
            for (const particle of particles) {
                drawParticle(context, particle);
            }

            lastRenderTimeRef.current = timeNow;
        }
        animationFrameRequestRef.current = requestAnimationFrame(renderFrame);
    }, [clearBackground, drawParticle, universeStore]);

    useEffect(() => {
        setCanvasDimensions();
        window.addEventListener('resize', setCanvasDimensions);
    }, [setCanvasDimensions]);

    useEffect(() => {
        lastRenderTimeRef.current = Date.now();
        animationFrameRequestRef.current = requestAnimationFrame(renderFrame);
        return () => {
            if (animationFrameRequestRef.current != null) {
                cancelAnimationFrame(animationFrameRequestRef.current);
            }
        };
    }, [renderFrame]);

    return (
        <div ref={parent} style={{ width: '100%', maxWidth: '100vw' }}>
            <canvas ref={canvasRef} width={size.width} height={size.height}>
                {t('canvas_error')}
            </canvas>
        </div>
    );
};

export default observer(Mariaverse);
