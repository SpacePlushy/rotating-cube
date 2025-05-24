import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import './Cube.css';

interface CubeProps {
  rotationSpeed?: number;
  color?: string;
  wireframe?: boolean;
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
    
    // Clear any existing content
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create the cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
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
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [color, wireframe]);
  
  return <div className="cubeContainer" ref={mountRef}></div>;
};

export default Cube;
