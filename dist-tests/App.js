import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef, useEffect } from 'react';
import Cube from './components/Cube/Cube.js';
import Controls from './components/Controls/Controls.js';
function App() {
    // Main cube properties
    const [cubeProps, setCubeProps] = useState({
        color: '#00ff00',
        rotationSpeed: 0.01,
        wireframe: false,
        shape: 'cube'
    });
    const [lightMode, setLightMode] = useState(false);
    useEffect(() => {
        document.body.classList.toggle('light-mode', lightMode);
    }, [lightMode]);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.__testState = {
                currentColor: cubeProps.color,
                currentShape: cubeProps.shape,
                isWireframe: cubeProps.wireframe
            };
        }
    }, [cubeProps]);
    // Refs to store rotation handler functions from the Cube component
    const manualRotationHandlerRef = useRef(null);
    const resetRotationHandlerRef = useRef(null);
    // Handler for color changes from the Controls component
    const handleColorChange = useCallback((color) => {
        setCubeProps(prev => ({ ...prev, color }));
    }, []);
    // Handler for rotation speed changes from the Controls component
    const handleSpeedChange = useCallback((rotationSpeed) => {
        setCubeProps(prev => ({ ...prev, rotationSpeed }));
    }, []);
    // Handler for wireframe toggle from the Controls component
    const handleWireframeToggle = useCallback((wireframe) => {
        setCubeProps(prev => ({ ...prev, wireframe }));
    }, []);
    // Change shape of the geometry
    const handleShapeChange = useCallback((newShape) => {
        setCubeProps(prev => ({
            ...prev,
            shape: newShape
        }));
    }, []);
    // Set up the rotation direction handler to be passed to Controls
    const handleRotationDirectionChange = useCallback((x, y) => {
        if (manualRotationHandlerRef.current) {
            manualRotationHandlerRef.current(x, y);
        }
    }, []);
    // Set up reset rotation handler to be passed to Controls
    const handleResetRotation = useCallback(() => {
        if (resetRotationHandlerRef.current) {
            resetRotationHandlerRef.current();
        }
    }, []);
    // Store rotation handler from Cube component
    const storeManualRotationHandler = useCallback((handler) => {
        manualRotationHandlerRef.current = handler;
    }, []);
    // Store reset handler from Cube component
    const storeResetRotationHandler = useCallback((handler) => {
        resetRotationHandlerRef.current = handler;
    }, []);
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { children: [_jsx("h1", { children: "3D Rotating Cube" }), _jsx("button", { className: "lightToggleBtn", onClick: () => setLightMode(prev => !prev), "data-testid": "light-mode-toggle", children: lightMode ? 'Dark Mode' : 'Light Mode' })] }), _jsx(Cube, { color: cubeProps.color, rotationSpeed: cubeProps.rotationSpeed, wireframe: cubeProps.wireframe, shape: cubeProps.shape, onRotationDirectionChange: storeManualRotationHandler, onResetRotation: storeResetRotationHandler }), _jsx(Controls, { onColorChange: handleColorChange, onSpeedChange: handleSpeedChange, onWireframeToggle: handleWireframeToggle, onShapeChange: handleShapeChange, onRotationDirectionChange: handleRotationDirectionChange, onResetRotation: handleResetRotation })] }));
}
export default App;
