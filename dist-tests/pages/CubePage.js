import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef, useEffect } from 'react';
import Cube from '../components/Cube/Cube.js';
import Controls from '../components/Controls/Controls.js';
const CubePage = () => {
    const [cubeProps, setCubeProps] = useState({
        color: '#00ff00',
        rotationSpeed: 0.01,
        wireframe: false,
        shape: 'cube'
    });
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.__testState = {
                currentColor: cubeProps.color,
                currentShape: cubeProps.shape,
                isWireframe: cubeProps.wireframe
            };
        }
    }, [cubeProps]);
    const manualRotationHandlerRef = useRef(null);
    const resetRotationHandlerRef = useRef(null);
    const handleColorChange = useCallback((color) => {
        setCubeProps(prev => ({ ...prev, color }));
    }, []);
    const handleSpeedChange = useCallback((rotationSpeed) => {
        setCubeProps(prev => ({ ...prev, rotationSpeed }));
    }, []);
    const handleWireframeToggle = useCallback((wireframe) => {
        setCubeProps(prev => ({ ...prev, wireframe }));
    }, []);
    const handleShapeChange = useCallback((newShape) => {
        setCubeProps(prev => ({ ...prev, shape: newShape }));
    }, []);
    const handleRotationDirectionChange = useCallback((x, y) => {
        if (manualRotationHandlerRef.current) {
            manualRotationHandlerRef.current(x, y);
        }
    }, []);
    const handleResetRotation = useCallback(() => {
        if (resetRotationHandlerRef.current) {
            resetRotationHandlerRef.current();
        }
    }, []);
    const storeManualRotationHandler = useCallback((handler) => {
        manualRotationHandlerRef.current = handler;
    }, []);
    const storeResetRotationHandler = useCallback((handler) => {
        resetRotationHandlerRef.current = handler;
    }, []);
    return (_jsxs("div", { children: [_jsx(Cube, { color: cubeProps.color, rotationSpeed: cubeProps.rotationSpeed, wireframe: cubeProps.wireframe, shape: cubeProps.shape, onRotationDirectionChange: storeManualRotationHandler, onResetRotation: storeResetRotationHandler }), _jsx(Controls, { onColorChange: handleColorChange, onSpeedChange: handleSpeedChange, onWireframeToggle: handleWireframeToggle, onShapeChange: handleShapeChange, onRotationDirectionChange: handleRotationDirectionChange, onResetRotation: handleResetRotation })] }));
};
export default CubePage;
