import { useState, useCallback, useRef, useEffect } from 'react'
import '../App.css'
import Cube from '../components/Cube/Cube'
import Controls from '../components/Controls/Controls'

// Add global interface for window test state
declare global {
  interface Window {
    __testState?: {
      currentColor: string;
      currentShape: string;
      isWireframe: boolean;
    };
  }
}

type Shape =
  | 'cube'
  | 'pyramid'
  | 'sphere'
  | 'cylinder'
  | 'cone'
  | 'torus'
  | 'dodecahedron'

function HomePage() {
  // Main cube properties
  const [cubeProps, setCubeProps] = useState({
    color: '#00ff00',
    rotationSpeed: 0.01,
    wireframe: false,
    shape: 'cube' as Shape
  })

  const [lightMode, setLightMode] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('light-mode', lightMode)
  }, [lightMode])

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
  const manualRotationHandlerRef = useRef<((x: number, y: number) => void) | null>(null);
  const resetRotationHandlerRef = useRef<(() => void) | null>(null);

  // Handler for color changes from the Controls component
  const handleColorChange = useCallback((color: string) => {
    setCubeProps(prev => ({ ...prev, color }))
  }, [])

  // Handler for rotation speed changes from the Controls component
  const handleSpeedChange = useCallback((rotationSpeed: number) => {
    setCubeProps(prev => ({ ...prev, rotationSpeed }))
  }, [])

  // Handler for wireframe toggle from the Controls component
  const handleWireframeToggle = useCallback((wireframe: boolean) => {
    setCubeProps(prev => ({ ...prev, wireframe }))
  }, [])

  // Change shape of the geometry
  const handleShapeChange = useCallback((newShape: Shape) => {
    setCubeProps(prev => ({
      ...prev,
      shape: newShape
    }))
  }, [])

  // Set up the rotation direction handler to be passed to Controls
  const handleRotationDirectionChange = useCallback((x: number, y: number) => {
    if (manualRotationHandlerRef.current) {
      manualRotationHandlerRef.current(x, y);
    }
  }, [])

  // Set up reset rotation handler to be passed to Controls
  const handleResetRotation = useCallback(() => {
    if (resetRotationHandlerRef.current) {
      resetRotationHandlerRef.current();
    }
  }, [])

  // Store rotation handler from Cube component
  const storeManualRotationHandler = useCallback((handler: (x: number, y: number) => void) => {
    manualRotationHandlerRef.current = handler;
  }, [])

  // Store reset handler from Cube component
  const storeResetRotationHandler = useCallback((handler: () => void) => {
    resetRotationHandlerRef.current = handler;
  }, [])

  return (
    <div className="app">
      <div className="cube-container">
        <h1>3D Rotating Cube</h1>
        <button
          className="lightToggleBtn"
          onClick={() => setLightMode(prev => !prev)}
          data-testid="light-mode-toggle"
        >
          {lightMode ? 'Dark Mode' : 'Light Mode'}
        </button>
        
        <Cube
          color={cubeProps.color}
          rotationSpeed={cubeProps.rotationSpeed}
          wireframe={cubeProps.wireframe}
          shape={cubeProps.shape}
          onRotationDirectionChange={storeManualRotationHandler}
          onResetRotation={storeResetRotationHandler}
        />

        <Controls
          onColorChange={handleColorChange}
          onSpeedChange={handleSpeedChange}
          onWireframeToggle={handleWireframeToggle}
          onShapeChange={handleShapeChange}
          onRotationDirectionChange={handleRotationDirectionChange}
          onResetRotation={handleResetRotation}
        />
      </div>
    </div>
  )
}

export default HomePage
