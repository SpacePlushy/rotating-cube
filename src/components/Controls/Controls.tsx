import { useState, useEffect } from 'react';
import './Controls.css';

type Shape =
  | 'cube'
  | 'pyramid'
  | 'sphere'
  | 'cylinder'
  | 'cone'
  | 'torus'
  | 'dodecahedron';

interface ControlsProps {
  onColorChange: (color: string) => void;
  onSpeedChange: (speed: number) => void;
  onWireframeToggle: (wireframe: boolean) => void;
  onShapeChange: (shape: Shape) => void;
  onRotationDirectionChange: (x: number, y: number) => void;
  onResetRotation: () => void;
}

const Controls = ({
  onColorChange,
  onSpeedChange,
  onWireframeToggle,
  onShapeChange,
  onRotationDirectionChange,
  onResetRotation
}: ControlsProps) => {
  const [color, setColor] = useState('#00ff00');
  const [speed, setSpeed] = useState(0.01);
  const [wireframe, setWireframe] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [shape, setShape] = useState<Shape>('cube');
  
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
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };
  
  const handleWireframeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isWireframe = e.target.checked;
    setWireframe(isWireframe);
    onWireframeToggle(isWireframe);
  };

  const handleWireframeButtonClick = () => {
    const newWireframeState = !wireframe;
    setWireframe(newWireframeState);
    onWireframeToggle(newWireframeState);
  };

  const handleShapeChangeSelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newShape = e.target.value as Shape;
    setShape(newShape);
    onShapeChange(newShape);
  };

  const handleColorPresetClick = (colorValue: string) => {
    setColor(colorValue);
    onColorChange(colorValue);
    
    // Update the color picker element value
    const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
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

  const handleSpeedPresetClick = (speedValue: number) => {
    setSpeed(speedValue);
    onSpeedChange(speedValue);
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
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
  
  return (
    <div className="controls">
      <h2>Cube Controls</h2>
      
      {/* Color selection */}
      <div className="controlGroup">
        <label htmlFor="colorPicker">Color:</label>
        <input
          type="color"
          id="colorPicker"
          value={color}
          onChange={handleColorChange}
          data-testid="color-picker"
        />
        <div className="buttonGroup">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              className="colorBtn"
              style={{ backgroundColor: preset.value }}
              onClick={() => handleColorPresetClick(preset.value)}
              data-testid={`color-preset-${preset.name.toLowerCase()}`}
              data-color-value={preset.value}
            >
              {preset.name[0]}
            </button>
          ))}
        </div>
      </div>
      
      {/* Rotation speed */}
      <div className="controlGroup">
        <label htmlFor="speedSlider">Rotation Speed:</label>
        <input
          type="range"
          id="speedSlider"
          min="0"
          max="0.05"
          step="0.001"
          value={speed}
          onChange={handleSpeedChange}
          data-testid="speed-slider"
        />
        <span>{speed.toFixed(3)}</span>
        <div className="buttonGroup">
          {speedPresets.map((preset) => (
            <button
              key={preset.name}
              className="speedBtn"
              onClick={() => handleSpeedPresetClick(preset.value)}
              data-testid={`speed-${preset.name.toLowerCase().replace(' ', '-')}`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Wireframe toggle */}
      <div className="controlGroup">
        <div className="toggleRow">
          <input
            type="checkbox"
            id="wireframeToggle"
            checked={wireframe}
            onChange={handleWireframeToggle}
            data-testid="wireframe-checkbox"
          />
          <label htmlFor="wireframeToggle">Wireframe:</label>
        </div>
        <button 
          className="actionBtn"
          onClick={handleWireframeButtonClick}
          data-testid="wireframe-button"
        >
          {wireframe ? 'Disable Wireframe' : 'Enable Wireframe'}
        </button>
      </div>

      {/* Shape selection */}
      <div className="controlGroup">
        <label htmlFor="shapeSelect">Shape:</label>
        <select
          id="shapeSelect"
          value={shape}
          onChange={handleShapeChangeSelect}
          data-testid="shape-select"
        >
          <option value="cube">Cube</option>
          <option value="pyramid">Pyramid</option>
          <option value="sphere">Sphere</option>
          <option value="cylinder">Cylinder</option>
          <option value="cone">Cone</option>
          <option value="torus">Torus</option>
          <option value="dodecahedron">Dodecahedron</option>
        </select>
      </div>

      {/* Rotation controls */}
      <div className="controlGroup">
        <label>Manual Rotation:</label>
        <div className="rotationControls">
          <button 
            className="directionBtn"
            onClick={() => onRotationDirectionChange(0, -0.1)}
            data-testid="rotate-left"
          >
            ←
          </button>
          <div className="verticalBtns">
            <button 
              className="directionBtn"
              onClick={() => onRotationDirectionChange(0.1, 0)}
              data-testid="rotate-up"
            >
              ↑
            </button>
            <button 
              className="directionBtn"
              onClick={() => onRotationDirectionChange(-0.1, 0)}
              data-testid="rotate-down"
            >
              ↓
            </button>
          </div>
          <button 
            className="directionBtn"
            onClick={() => onRotationDirectionChange(0, 0.1)}
            data-testid="rotate-right"
          >
            →
          </button>
        </div>
        <button 
          className="resetBtn"
          onClick={onResetRotation}
          data-testid="reset-rotation"
        >
          Reset Rotation
        </button>
      </div>

      {/* Help toggle */}
      <button 
        className="helpBtn"
        onClick={() => setShowHelp(!showHelp)}
      >
        {showHelp ? 'Hide Keyboard Controls' : 'Show Keyboard Controls'}
      </button>

      {/* Keyboard controls help */}
      {showHelp && (
        <div className="helpPanel">
          <h3>Keyboard Controls:</h3>
          <ul>
            <li><strong>Arrow Keys</strong>: Rotate cube</li>
            <li><strong>R</strong>: Reset rotation</li>
            <li><strong>W</strong>: Toggle wireframe</li>
            <li><strong>+/-</strong>: Increase/decrease speed</li>
            <li><strong>H</strong>: Toggle this help panel</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Controls;
