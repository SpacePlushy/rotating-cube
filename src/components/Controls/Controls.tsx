import { useState, useEffect } from 'react';
import './Controls.css';

interface ControlsProps {
  onColorChange: (color: string) => void;
  onSpeedChange: (speed: number) => void;
  onWireframeToggle: (wireframe: boolean) => void;
  onRotationDirectionChange: (x: number, y: number) => void;
  onResetRotation: () => void;
}

const Controls = ({
  onColorChange,
  onSpeedChange,
  onWireframeToggle,
  onRotationDirectionChange,
  onResetRotation
}: ControlsProps) => {
  const [color, setColor] = useState('#00ff00');
  const [speed, setSpeed] = useState(0.01);
  const [wireframe, setWireframe] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
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

  const setPresetColor = (colorValue: string) => {
    setColor(colorValue);
    onColorChange(colorValue);
  };

  const setPresetSpeed = (speedValue: number) => {
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
        case '=':
          const increasedSpeed = Math.min(speed + 0.005, 0.1);
          setSpeed(increasedSpeed);
          onSpeedChange(increasedSpeed);
          break;
        case '-':
        case '_':
          const decreasedSpeed = Math.max(speed - 0.005, 0);
          setSpeed(decreasedSpeed);
          onSpeedChange(decreasedSpeed);
          break;
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
      
      {/* Color controls */}
      <div className="controlGroup">
        <label htmlFor="color">Color:</label>
        <input 
          type="color" 
          id="color" 
          value={color} 
          onChange={handleColorChange} 
        />
        <div className="buttonGroup">
          {colorPresets.map(preset => (
            <button 
              key={preset.name}
              className="colorBtn"
              style={{ backgroundColor: preset.value }}
              onClick={() => setPresetColor(preset.value)}
              title={preset.name}
            >
              {preset.name[0]}
            </button>
          ))}
        </div>
      </div>
      
      {/* Speed controls */}
      <div className="controlGroup">
        <label htmlFor="speed">Rotation Speed:</label>
        <input 
          type="range" 
          id="speed" 
          min="0" 
          max="0.1" 
          step="0.001" 
          value={speed} 
          onChange={handleSpeedChange} 
        />
        <span>{speed.toFixed(3)}</span>
        <div className="buttonGroup">
          {speedPresets.map(preset => (
            <button 
              key={preset.name}
              className="speedBtn"
              onClick={() => setPresetSpeed(preset.value)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Wireframe toggle */}
      <div className="controlGroup">
        <label htmlFor="wireframe">Wireframe:</label>
        <div className="toggleRow">
          <input 
            type="checkbox" 
            id="wireframe" 
            checked={wireframe} 
            onChange={handleWireframeToggle} 
          />
          <button 
            className="actionBtn"
            onClick={() => {
              setWireframe(!wireframe);
              onWireframeToggle(!wireframe);
            }}
          >
            Toggle Wireframe
          </button>
        </div>
      </div>

      {/* Rotation controls */}
      <div className="controlGroup">
        <label>Manual Rotation:</label>
        <div className="rotationControls">
          <button 
            className="directionBtn"
            onClick={() => onRotationDirectionChange(0, -0.1)}
          >
            ←
          </button>
          <div className="verticalBtns">
            <button 
              className="directionBtn"
              onClick={() => onRotationDirectionChange(0.1, 0)}
            >
              ↑
            </button>
            <button 
              className="directionBtn"
              onClick={() => onRotationDirectionChange(-0.1, 0)}
            >
              ↓
            </button>
          </div>
          <button 
            className="directionBtn"
            onClick={() => onRotationDirectionChange(0, 0.1)}
          >
            →
          </button>
        </div>
        <button 
          className="resetBtn"
          onClick={onResetRotation}
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
