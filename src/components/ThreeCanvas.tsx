import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  onCoreClick?: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ onCoreClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Holographic Neural Geodesic Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(2, 3);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1, // Indigo
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const neuralSphere = new THREE.Mesh(sphereGeo, wireframeMat);
    scene.add(neuralSphere);

    // Inner glowing core
    const coreGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7, // Purple
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);
    scene.add(innerCore);

    // 3. Orbital Gyro Rings
    const ringGeo1 = new THREE.TorusGeometry(2.6, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan
      transparent: true,
      opacity: 0.8,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.9, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xec4899, // Pink
      transparent: true,
      opacity: 0.6,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 4. Floating Neural Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.75,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 5. Mouse Interaction Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = (event.clientX - rect.left) / width - 0.5;
      const y = (event.clientY - rect.top) / height - 0.5;
      targetX = x * 2;
      targetY = y * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Click Shockwave Trigger
    let shockwaveScale = 1;
    let isShockwaveActive = false;

    const handleClick = () => {
      isShockwaveActive = true;
      shockwaveScale = 1;
      if (onCoreClick) onCoreClick();
    };

    currentMount.addEventListener('click', handleClick);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Rotate sphere & core
      neuralSphere.rotation.x = elapsedTime * 0.15 + mouseY * 0.5;
      neuralSphere.rotation.y = elapsedTime * 0.2 + mouseX * 0.5;

      innerCore.rotation.x = -elapsedTime * 0.3;
      innerCore.rotation.y = elapsedTime * 0.4;
      const pulse = 1 + Math.sin(elapsedTime * 3) * 0.08;
      innerCore.scale.set(pulse, pulse, pulse);

      // Rotate rings
      ring1.rotation.z += 0.01;
      ring1.rotation.x += 0.005;
      ring2.rotation.y += 0.015;
      ring2.rotation.z -= 0.008;

      // Rotate particles
      particleSystem.rotation.y = elapsedTime * 0.03;

      // Handle shockwave
      if (isShockwaveActive) {
        shockwaveScale += 0.08;
        wireframeMat.opacity = Math.max(0.2, 1 - (shockwaveScale - 1) * 0.8);
        neuralSphere.scale.set(shockwaveScale, shockwaveScale, shockwaveScale);
        if (shockwaveScale > 1.6) {
          isShockwaveActive = false;
          shockwaveScale = 1;
          neuralSphere.scale.set(1, 1, 1);
          wireframeMat.opacity = 0.35;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Handle Window Resize
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      wireframeMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [onCoreClick]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full cursor-pointer relative"
      title="Klik untuk cetus Gelombang Neural!"
    >
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <span className="text-[10px] font-mono-code text-cyan-400/80 bg-slate-900/60 px-3 py-1 rounded-full border border-cyan-500/20 backdrop-blur-sm">
          ⚡ 3D NEURAL CORE ACTIVE • KLIK UNTUK SHOCKWAVE
        </span>
      </div>
    </div>
  );
};
