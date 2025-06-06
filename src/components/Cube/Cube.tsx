import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import './Cube.css';

type Shape =
  | 'cube'
  | 'pyramid'
  | 'sphere'
  | 'cylinder'
  | 'cone'
  | 'torus'
  | 'dodecahedron';

interface CubeProps {
  rotationSpeed?: number;
  color?: string;
  wireframe?: boolean;
  shape?: Shape;
  onRotationDirectionChange?: (handler: (x: number, y: number) => void) => void;
  onResetRotation?: (handler: () => void) => void;
}

interface Rotation {
  x: number;
  y: number;
}

const Cube = ({
  rotationSpeed = 0.01,
  color = '#00ff00',
  wireframe = false,
  shape = 'cube',
  onRotationDirectionChange,
  onResetRotation
}: CubeProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<Rotation>({ x: 0, y: 0 });
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const autoRotationRef = useRef<boolean>(true);
  const rotationSpeedRef = useRef<number>(rotationSpeed);

  // Manual rotation handler
  const handleManualRotation = useCallback((xDelta: number, yDelta: number) => {
    if (cubeRef.current) {
      rotationRef.current = {
        x: rotationRef.current.x + xDelta,
        y: rotationRef.current.y + yDelta
      };
      autoRotationRef.current = false;
    }
  }, []);

  // Reset rotation handler
  const handleResetRotation = useCallback(() => {
    rotationRef.current = { x: 0, y: 0 };
    autoRotationRef.current = true;
  }, []);

  // Connect to keyboard controls from parent component
  useEffect(() => {
    // This function will be called from the Controls component
    if (typeof onRotationDirectionChange === 'function') {
      // We're just passing the handler reference up to the parent
      const handler = (x: number, y: number) => handleManualRotation(x, y);
      onRotationDirectionChange(handler);
    }
    
    if (typeof onResetRotation === 'function') {
      onResetRotation(handleResetRotation);
    }
  }, [handleManualRotation, handleResetRotation, onRotationDirectionChange, onResetRotation]);

  // Update rotation speed when prop changes
  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);
  
  useEffect(() => {
    if (!mountRef.current) return;
    const mountElement = mountRef.current;
    
    // Clear any existing content
    while (mountElement.firstChild) {
      mountElement.removeChild(mountElement.firstChild);
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountElement.appendChild(renderer.domElement);
    
    // Create the mesh geometry based on selected shape
    let geometry: THREE.BufferGeometry;
    switch (shape) {
      case 'pyramid':
        geometry = new THREE.TetrahedronGeometry(2);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(2, 32, 32);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(1.5, 3, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(1.5, 0.6, 16, 100);
        break;
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(2);
        break;
      default:
        geometry = new THREE.BoxGeometry(2, 2, 2);
        break;
    }
    const material = new THREE.MeshStandardMaterial({ 
      color: color,
      wireframe: wireframe,
      roughness: 0.5,
      metalness: 0.7
    });
    
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Store refs for external access
    cubeRef.current = cube;
    sceneRef.current = scene;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    camera.position.z = 5;
    
    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);

    // --- Mouse Drag Controls ---
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerDown = (event: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
      autoRotationRef.current = false;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging) return;
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      // Rotate cube according to drag distance
      handleManualRotation(deltaMove.y * 0.005, deltaMove.x * 0.005);

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const endDrag = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', endDrag);
    renderer.domElement.addEventListener('pointerleave', endDrag);
    
    // Animation loop
    let frameId: number;
    
    // Define the animation function
    function animate() {
      frameId = requestAnimationFrame(animate);
      
      // Apply auto rotation if enabled
      if (autoRotationRef.current) {
        rotationRef.current.x += rotationSpeedRef.current;
        rotationRef.current.y += rotationSpeedRef.current;
      }
      
      // Apply rotation values to the cube
      if (cubeRef.current) {
        cubeRef.current.rotation.x = rotationRef.current.x;
        cubeRef.current.rotation.y = rotationRef.current.y;
      }
      
      // Render the scene
      renderer.render(scene, camera);
    }
    
    // Start the animation loop
    frameId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', endDrag);
      renderer.domElement.removeEventListener('pointerleave', endDrag);
      if (mountElement && mountElement.contains(renderer.domElement)) {
        mountElement.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [color, wireframe, shape, handleManualRotation]);
  
  return <div className="cubeContainer" ref={mountRef}></div>;
};

export default Cube;
