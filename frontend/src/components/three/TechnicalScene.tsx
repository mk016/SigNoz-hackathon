"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Isometric "technical" scenes used by the four Core Architecture cards.
 * Orthographic camera, pulsing emissive accent, gentle group sway —
 * a 1:1 port of the original createTechnicalScene() helper.
 */

export type TechnicalSceneVariant = "lattice" | "consensus" | "access" | "audit";

const ACCENT_COLOR = 0x818cf8;
const BASE_COLOR = 0x18181b;
const WIRE_COLOR = 0x3f3f46;

type Animatables = ((time: number) => void) | null;
type Setup = (
  group: THREE.Group,
  baseMat: THREE.MeshStandardMaterial,
  accentMat: THREE.MeshStandardMaterial,
  wireMat: THREE.LineBasicMaterial,
  darkWireMat: THREE.LineBasicMaterial
) => Animatables;

/* ------------------------- Scene 1 — Quantum Lattice Array --------- */
const latticeSetup: Setup = (group, baseMat, _accentMat, wireMat) => {
  const cylGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.5, 8);
  const base = new THREE.Mesh(cylGeo, baseMat);
  group.add(base);

  const ringGroup = new THREE.Group();
  for (let i = 1; i <= 3; i++) {
    const tGeo = new THREE.TorusGeometry(2 + i * 0.8, 0.02, 4, 16);
    const ring = new THREE.LineSegments(new THREE.EdgesGeometry(tGeo), wireMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = (i - 2) * 0.5;
    ringGroup.add(ring);
  }
  group.add(ringGroup);

  return (time: number) => {
    ringGroup.rotation.y = time * 0.5;
    ringGroup.children.forEach((r, i) => {
      r.position.y = Math.sin(time * 2 + i) * 0.2;
    });
  };
};

/* --------------------- Scene 2 — Distributed Node Consensus -------- */
const consensusSetup: Setup = (group, baseMat, accentMat, wireMat, darkWireMat) => {
  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(boxGeo), wireMat);
  group.add(edges);

  const nodes: { mesh: THREE.Mesh; basePos: number[]; offset: number }[] = [];
  const positions = [
    [-4, 1, -4],
    [4, -1, 4],
    [-4, -1, 4],
    [4, 1, -4],
    [0, 2, -5],
    [-5, 0, 0],
    [5, 0, 0],
  ];

  positions.forEach((pos) => {
    const nGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const node = new THREE.Mesh(nGeo, baseMat);
    node.position.set(pos[0], pos[1], pos[2]);

    const coreGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const core = new THREE.Mesh(coreGeo, accentMat);
    node.add(core);

    nodes.push({ mesh: node, basePos: pos, offset: Math.random() * Math.PI * 2 });
    group.add(node);

    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(pos[0], pos[1], pos[2])];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, darkWireMat);
    group.add(line);
  });

  return (time: number) => {
    nodes.forEach((n) => {
      n.mesh.position.y = n.basePos[1] + Math.sin(time * 2 + n.offset) * 0.3;
    });
  };
};

/* --------------------- Scene 3 — Multi-Tenant Access Control ------- */
const accessSetup: Setup = (group, baseMat, accentMat, wireMat, darkWireMat) => {
  const platformGeo = new THREE.BoxGeometry(8, 0.2, 8);
  const platform = new THREE.LineSegments(new THREE.EdgesGeometry(platformGeo), darkWireMat);
  group.add(platform);

  const clusters = [
    [-2, -2],
    [2, 2],
    [-2, 2],
    [2, -2],
  ];
  clusters.forEach((pos, i) => {
    const pGeo = new THREE.BoxGeometry(1.5, 0.5, 1.5);
    const p = new THREE.Mesh(pGeo, baseMat);
    p.position.set(pos[0], 0.25, pos[1]);
    group.add(p);

    if (i < 3) {
      const actGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const act = new THREE.Mesh(actGeo, i === 0 ? accentMat : baseMat);
      const actWire = new THREE.LineSegments(new THREE.EdgesGeometry(actGeo), wireMat);
      act.add(actWire);
      act.position.set(pos[0], 0.9, pos[1]);
      group.add(act);
    }
  });

  return null;
};

/* ---------------------- Scene 4 — Immutable Audit Trails ----------- */
const auditSetup: Setup = (group, baseMat, accentMat, _wireMat, darkWireMat) => {
  const layers: { mesh: THREE.Mesh; offset: number }[] = [];
  for (let i = 0; i < 4; i++) {
    const sGeo = new THREE.BoxGeometry(3, 0.3, 3);
    const slab = new THREE.Mesh(sGeo, baseMat);
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(sGeo), darkWireMat);
    slab.add(wire);

    if (i === 2) {
      const dotGeo = new THREE.BoxGeometry(0.2, 0.4, 0.2);
      const dot = new THREE.Mesh(dotGeo, accentMat);
      dot.position.set(1, 0, 1);
      slab.add(dot);
    }

    slab.position.y = i * 1.2 - 1.8;
    layers.push({ mesh: slab, offset: i * 0.5 });
    group.add(slab);
  }

  return (time: number) => {
    layers.forEach((l) => {
      l.mesh.position.y = l.offset * 2.4 - 1.8 + Math.sin(time + l.offset) * 0.1;
    });
  };
};

const setups: Record<TechnicalSceneVariant, Setup> = {
  lattice: latticeSetup,
  consensus: consensusSetup,
  access: accessSetup,
  audit: auditSetup,
};

export default function TechnicalScene({
  variant,
  label,
}: {
  variant: TechnicalSceneVariant;
  label: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const aspect = container.clientWidth / container.clientHeight;
    const d = 8;
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(ACCENT_COLOR, 2, 20);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const baseMaterial = new THREE.MeshStandardMaterial({
      color: BASE_COLOR,
      roughness: 0.8,
      metalness: 0.2,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: ACCENT_COLOR,
      emissive: ACCENT_COLOR,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const wireMaterial = new THREE.LineBasicMaterial({
      color: ACCENT_COLOR,
      transparent: true,
      opacity: 0.3,
    });
    const darkWireMaterial = new THREE.LineBasicMaterial({
      color: WIRE_COLOR,
      transparent: true,
      opacity: 0.5,
    });

    const group = new THREE.Group();
    scene.add(group);

    const gridHelper = new THREE.GridHelper(20, 10, WIRE_COLOR, 0x1a1a1a);
    gridHelper.position.y = -3;
    const gridMaterial = gridHelper.material as THREE.Material;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.2;
    group.add(gridHelper);

    const animatables = setups[variant](group, baseMaterial, accentMaterial, wireMaterial, darkWireMaterial);

    const onResize = () => {
      if (!container.clientWidth) return;
      const newAspect = container.clientWidth / container.clientHeight;
      camera.left = -d * newAspect;
      camera.right = d * newAspect;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      const pulse = (Math.sin(elapsedTime * 2) + 1) * 0.5;
      accentMaterial.emissiveIntensity = 0.4 + pulse * 0.8;
      pointLight.intensity = 1 + pulse * 1.5;

      group.rotation.y = Math.sin(elapsedTime * 0.2) * 0.15;

      if (animatables) animatables(elapsedTime);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [variant]);

  return <div ref={containerRef} className="absolute inset-0" role="img" aria-label={label} />;
}
