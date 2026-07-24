"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero wireframe model — rotating wire boxes, twin torus rings and
 * 8 orbiting nodes. 1:1 port of the original canvas script.
 */
export default function WireframeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const parent = canvas.parentElement;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.9, 7);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const group = new THREE.Group();
    scene.add(group);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xd4d4d8,
      transparent: true,
      opacity: 0.72,
    });
    const faintMaterial = new THREE.LineBasicMaterial({
      color: 0x71717a,
      transparent: true,
      opacity: 0.34,
    });

    function addWireBox(
      width: number,
      height: number,
      depth: number,
      y: number,
      material: THREE.LineBasicMaterial
    ) {
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const edges = new THREE.EdgesGeometry(geometry);
      const mesh = new THREE.LineSegments(edges, material);
      mesh.position.y = y;
      group.add(mesh);
      return mesh;
    }

    function addWireTorus(radius: number, tube: number, y: number, material: THREE.LineBasicMaterial) {
      const geometry = new THREE.TorusGeometry(radius, tube, 18, 96);
      const wire = new THREE.WireframeGeometry(geometry);
      const mesh = new THREE.LineSegments(wire, material);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.y = y;
      group.add(mesh);
      return mesh;
    }

    addWireBox(2.1, 1.25, 2.1, 0, lineMaterial);
    const top = addWireBox(1.65, 0.24, 1.65, 1.05, faintMaterial);
    const bottom = addWireBox(1.75, 0.2, 1.75, -1.08, faintMaterial);
    const ringA = addWireTorus(1.85, 0.018, 0.55, lineMaterial);
    const ringB = addWireTorus(2.35, 0.014, -0.55, faintMaterial);

    const nodeMaterial = new THREE.LineBasicMaterial({
      color: 0xf4f4f5,
      transparent: true,
      opacity: 0.55,
    });
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const geometry = new THREE.BoxGeometry(0.24, 0.24, 0.24);
      const edges = new THREE.EdgesGeometry(geometry);
      const node = new THREE.LineSegments(edges, nodeMaterial);
      node.position.set(Math.cos(angle) * 2.55, Math.sin(i) * 0.34, Math.sin(angle) * 2.55);
      group.add(node);
    }

    function resizeRenderer() {
      const rect = parent.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resizeRenderer);
    resizeRenderer();

    let time = 0;
    let rafId = 0;
    function animate() {
      time += 0.01;
      group.rotation.y += 0.004;
      group.rotation.x = Math.sin(time) * 0.08;
      top.position.y = 1.05 + Math.sin(time * 1.2) * 0.06;
      bottom.position.y = -1.08 + Math.cos(time * 1.1) * 0.05;
      ringA.rotation.z += 0.003;
      ringB.rotation.z -= 0.002;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeRenderer);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Animated structural wireframe model"
      className="absolute inset-0 h-full w-full"
    />
  );
}
