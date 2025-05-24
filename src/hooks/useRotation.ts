import { useState, useCallback } from 'react';

interface Rotation {
  x: number;
  y: number;
}

export const useRotation = (initialRotation: Rotation = { x: 0, y: 0 }) => {
  const [rotation, setRotation] = useState<Rotation>(initialRotation);
  
  const resetRotation = useCallback(() => {
    setRotation({ x: 0, y: 0 });
  }, []);
  
  return {
    rotation,
    setRotation,
    resetRotation
  };
};
