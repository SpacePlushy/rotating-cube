import { useState, useCallback, useRef, useEffect } from 'react'
import Cube from '../components/Cube/Cube'
import Controls from '../components/Controls/Controls'

// Add global interface for window test state
declare global {
  interface Window {
    __testState?: {
      currentColor: string
      currentShape: string
      isWireframe: boolean
    }
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

const CubePage = () => {
  // Main cube properties
  const [cubeProps, setCubeProps] = useState({
    color: '#00ff00',
    rotationSpeed: 0.01,
    wireframe: false,
    shape: 'cube' as Shape
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__testState = {
        currentColor: cubeProps.color,
        currentShape: cubeProps.shape,
        isWireframe: cubeProps.wireframe
      }
    }
  }, [cubeProps])

  const manualRotationHandlerRef = useRef<((x: number, y: number) => void) | null>(null)
  const resetRotationHandlerRef = useRef<(() => void) | null>(null)

  const handleColorChange = useCallback((color: string) => {
    setCubeProps(prev => ({ ...prev, color }))
  }, [])

  const handleSpeedChange = useCallback((rotationSpeed: number) => {
    setCubeProps(prev => ({ ...prev, rotationSpeed }))
  }, [])

  const handleWireframeToggle = useCallback((wireframe: boolean) => {
    setCubeProps(prev => ({ ...prev, wireframe }))
  }, [])

  const handleShapeChange = useCallback((newShape: Shape) => {
    setCubeProps(prev => ({
      ...prev,
      shape: newShape
    }))
  }, [])

  const handleRotationDirectionChange = useCallback((x: number, y: number) => {
    if (manualRotationHandlerRef.current) {
      manualRotationHandlerRef.current(x, y)
    }
  }, [])

  const handleResetRotation = useCallback(() => {
    if (resetRotationHandlerRef.current) {
      resetRotationHandlerRef.current()
    }
  }, [])

  const storeManualRotationHandler = useCallback((handler: (x: number, y: number) => void) => {
    manualRotationHandlerRef.current = handler
  }, [])

  const storeResetRotationHandler = useCallback((handler: () => void) => {
    resetRotationHandlerRef.current = handler
  }, [])

  return (
    <>
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
    </>
  )
}

export default CubePage
