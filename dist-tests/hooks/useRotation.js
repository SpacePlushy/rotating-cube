import { useState, useCallback } from 'react';
export const useRotation = (initialRotation = { x: 0, y: 0 }) => {
    const [rotation, setRotation] = useState(initialRotation);
    const resetRotation = useCallback(() => {
        setRotation({ x: 0, y: 0 });
    }, []);
    return {
        rotation,
        setRotation,
        resetRotation
    };
};
