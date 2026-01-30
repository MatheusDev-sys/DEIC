import React, { useEffect, useRef } from 'react';

interface LoadingHatchProps {
    size?: string;
    stroke?: string;
    speed?: string;
    color?: string;
}

// Declaração do custom element para TypeScript
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'l-hatch': {
                size?: string;
                stroke?: string;
                speed?: string;
                color?: string;
            };
        }
    }
}

export const LoadingHatch: React.FC<LoadingHatchProps> = ({
    size = '28',
    stroke = '4',
    speed = '3.5',
    color = '#0ea5e9' // sky-500
}) => {
    return (
        <l-hatch
            size={size}
            stroke={stroke}
            speed={speed}
            color={color}
        />
    );
};
