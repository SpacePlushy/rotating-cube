import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const Controls = ({ onColorChange, onSpeedChange, onWireframeToggle, onShapeChange, onRotationDirectionChange, onResetRotation }) => {
    const [color, setColor] = useState('#00ff00');
    const [speed, setSpeed] = useState(0.01);
    const [wireframe, setWireframe] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [shape, setShape] = useState('cube');
    // Predefined colors
    const colorPresets = [
        { name: 'Green', value: '#00ff00' },
        { name: 'Blue', value: '#0088ff' },
        { name: 'Red', value: '#ff0000' },
        { name: 'Yellow', value: '#ffff00' },
        { name: 'Purple', value: '#8800ff' }
    ];
    // Speed presets
    const speedPresets = [
        { name: 'Slow', value: 0.003 },
        { name: 'Medium', value: 0.01 },
        { name: 'Fast', value: 0.03 },
        { name: 'Very Fast', value: 0.05 }
    ];
    const handleColorChange = (e) => {
        const newColor = e.target.value;
        setColor(newColor);
        onColorChange(newColor);
        // Add data attributes for Puppeteer testing
        document.body.setAttribute('data-current-color', newColor);
        // Update container data attributes directly for better test reliability
        const cubeContainer = document.querySelector('[data-testid="cube-container"]');
        if (cubeContainer) {
            cubeContainer.setAttribute('data-color', newColor);
        }
    };
    const handleSpeedChange = (e) => {
        const newSpeed = parseFloat(e.target.value);
        setSpeed(newSpeed);
        onSpeedChange(newSpeed);
    };
    const handleWireframeToggle = (e) => {
        const isWireframe = e.target.checked;
        setWireframe(isWireframe);
        onWireframeToggle(isWireframe);
    };
    const handleWireframeButtonClick = () => {
        const newWireframeState = !wireframe;
        setWireframe(newWireframeState);
        onWireframeToggle(newWireframeState);
    };
    const handleShapeChangeSelect = (e) => {
        const newShape = e.target.value;
        setShape(newShape);
        onShapeChange(newShape);
    };
    const handleColorPresetClick = (colorValue) => {
        setColor(colorValue);
        onColorChange(colorValue);
        // Update the color picker element value
        const colorPicker = document.getElementById('colorPicker');
        if (colorPicker) {
            colorPicker.value = colorValue;
            // Trigger input and change events for the color picker
            colorPicker.dispatchEvent(new Event('input', { bubbles: true }));
            colorPicker.dispatchEvent(new Event('change', { bubbles: true }));
        }
        // Add data attributes for Puppeteer testing
        document.body.setAttribute('data-current-color', colorValue);
        // Update container data attributes directly for better test reliability
        const cubeContainer = document.querySelector('[data-testid="cube-container"]');
        if (cubeContainer) {
            cubeContainer.setAttribute('data-color', colorValue);
        }
    };
    const handleSpeedPresetClick = (speedValue) => {
        setSpeed(speedValue);
        onSpeedChange(speedValue);
    };
    // Handle keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    onRotationDirectionChange(0.1, 0);
                    break;
                case 'ArrowDown':
                    onRotationDirectionChange(-0.1, 0);
                    break;
                case 'ArrowLeft':
                    onRotationDirectionChange(0, -0.1);
                    break;
                case 'ArrowRight':
                    onRotationDirectionChange(0, 0.1);
                    break;
                case 'r':
                case 'R':
                    onResetRotation();
                    break;
                case 'w':
                case 'W':
                    onWireframeToggle(!wireframe);
                    setWireframe(!wireframe);
                    break;
                case '+':
                case '=': {
                    const increasedSpeed = Math.min(speed + 0.005, 0.1);
                    setSpeed(increasedSpeed);
                    onSpeedChange(increasedSpeed);
                    break;
                }
                case '-':
                case '_': {
                    const decreasedSpeed = Math.max(speed - 0.005, 0);
                    setSpeed(decreasedSpeed);
                    onSpeedChange(decreasedSpeed);
                    break;
                }
                case 'h':
                case 'H':
                    setShowHelp(!showHelp);
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [speed, wireframe, showHelp, onRotationDirectionChange, onResetRotation, onSpeedChange, onWireframeToggle]);
    return (_jsxs("div", { className: "controls", children: [_jsx("h2", { children: "Cube Controls" }), _jsxs("div", { className: "controlGroup", children: [_jsx("label", { htmlFor: "colorPicker", children: "Color:" }), _jsx("input", { type: "color", id: "colorPicker", value: color, onChange: handleColorChange, "data-testid": "color-picker" }), _jsx("div", { className: "buttonGroup", children: colorPresets.map((preset) => (_jsx("button", { className: "colorBtn", style: { backgroundColor: preset.value }, onClick: () => handleColorPresetClick(preset.value), "data-testid": `color-preset-${preset.name.toLowerCase()}`, "data-color-value": preset.value, children: preset.name[0] }, preset.name))) })] }), _jsxs("div", { className: "controlGroup", children: [_jsx("label", { htmlFor: "speedSlider", children: "Rotation Speed:" }), _jsx("input", { type: "range", id: "speedSlider", min: "0", max: "0.05", step: "0.001", value: speed, onChange: handleSpeedChange, "data-testid": "speed-slider" }), _jsx("span", { children: speed.toFixed(3) }), _jsx("div", { className: "buttonGroup", children: speedPresets.map((preset) => (_jsx("button", { className: "speedBtn", onClick: () => handleSpeedPresetClick(preset.value), "data-testid": `speed-${preset.name.toLowerCase().replace(' ', '-')}`, children: preset.name }, preset.name))) })] }), _jsxs("div", { className: "controlGroup", children: [_jsxs("div", { className: "toggleRow", children: [_jsx("input", { type: "checkbox", id: "wireframeToggle", checked: wireframe, onChange: handleWireframeToggle, "data-testid": "wireframe-checkbox" }), _jsx("label", { htmlFor: "wireframeToggle", children: "Wireframe:" })] }), _jsx("button", { className: "actionBtn", onClick: handleWireframeButtonClick, "data-testid": "wireframe-button", children: wireframe ? 'Disable Wireframe' : 'Enable Wireframe' })] }), _jsxs("div", { className: "controlGroup", children: [_jsx("label", { htmlFor: "shapeSelect", children: "Shape:" }), _jsxs("select", { id: "shapeSelect", value: shape, onChange: handleShapeChangeSelect, "data-testid": "shape-select", children: [_jsx("option", { value: "cube", children: "Cube" }), _jsx("option", { value: "pyramid", children: "Pyramid" }), _jsx("option", { value: "sphere", children: "Sphere" }), _jsx("option", { value: "cylinder", children: "Cylinder" }), _jsx("option", { value: "cone", children: "Cone" }), _jsx("option", { value: "torus", children: "Torus" }), _jsx("option", { value: "dodecahedron", children: "Dodecahedron" })] })] }), _jsxs("div", { className: "controlGroup", children: [_jsx("label", { children: "Manual Rotation:" }), _jsxs("div", { className: "rotationControls", children: [_jsx("button", { className: "directionBtn", onClick: () => onRotationDirectionChange(0, -0.1), "data-testid": "rotate-left", children: "\u2190" }), _jsxs("div", { className: "verticalBtns", children: [_jsx("button", { className: "directionBtn", onClick: () => onRotationDirectionChange(0.1, 0), "data-testid": "rotate-up", children: "\u2191" }), _jsx("button", { className: "directionBtn", onClick: () => onRotationDirectionChange(-0.1, 0), "data-testid": "rotate-down", children: "\u2193" })] }), _jsx("button", { className: "directionBtn", onClick: () => onRotationDirectionChange(0, 0.1), "data-testid": "rotate-right", children: "\u2192" })] }), _jsx("button", { className: "resetBtn", onClick: onResetRotation, "data-testid": "reset-rotation", children: "Reset Rotation" })] }), _jsx("button", { className: "helpBtn", onClick: () => setShowHelp(!showHelp), children: showHelp ? 'Hide Keyboard Controls' : 'Show Keyboard Controls' }), showHelp && (_jsxs("div", { className: "helpPanel", children: [_jsx("h3", { children: "Keyboard Controls:" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Arrow Keys" }), ": Rotate cube"] }), _jsxs("li", { children: [_jsx("strong", { children: "R" }), ": Reset rotation"] }), _jsxs("li", { children: [_jsx("strong", { children: "W" }), ": Toggle wireframe"] }), _jsxs("li", { children: [_jsx("strong", { children: "+/-" }), ": Increase/decrease speed"] }), _jsxs("li", { children: [_jsx("strong", { children: "H" }), ": Toggle this help panel"] })] })] }))] }));
};
export default Controls;
