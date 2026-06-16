"use client";

import { useRef, useEffect } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, MathUtils } from "three";
import { useEditorStore, ActiveCameraId } from "@/store/editorStore";
import gsap from "gsap";

// Preset camera positions for each courtroom camera role
const CAMERA_PRESETS: Record<ActiveCameraId, { position: [number, number, number]; target: [number, number, number] }> = {
  free: { position: [6, 5, 8], target: [0, 1, 0] },
  judge: { position: [0, 3, -6], target: [0, 1.5, 2] },
  defense: { position: [-4, 2, 0], target: [0, 1.5, -2] },
  witness: { position: [3, 2, 0], target: [0, 1.5, -1] },
  audience: { position: [0, 4, 10], target: [0, 1, 0] },
};

/**
 * CameraRig handles cinematic transitions between named courtroom cameras.
 * Uses GSAP to animate position/target smoothly on camera switch.
 *
 * In "free" mode, OrbitControls takes over (see Viewport.tsx).
 */
export function CameraRig() {
  const { camera } = useThree();
  const activeCamera = useEditorStore((s) => s.activeCamera);
  const targetRef = useRef(new Vector3(0, 1, 0));
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const preset = CAMERA_PRESETS[activeCamera];
    if (!preset) return;

    isAnimatingRef.current = true;

    const fromPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const toPos = { x: preset.position[0], y: preset.position[1], z: preset.position[2] };

    const fromTarget = { x: targetRef.current.x, y: targetRef.current.y, z: targetRef.current.z };
    const toTarget = { x: preset.target[0], y: preset.target[1], z: preset.target[2] };

    gsap.to(fromPos, {
      ...toPos,
      duration: 1.2,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.position.set(fromPos.x, fromPos.y, fromPos.z);
      },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    gsap.to(fromTarget, {
      ...toTarget,
      duration: 1.2,
      ease: "power3.inOut",
      onUpdate: () => {
        targetRef.current.set(fromTarget.x, fromTarget.y, fromTarget.z);
      },
    });
  }, [activeCamera, camera]);

  useFrame(() => {
    if (isAnimatingRef.current) {
      camera.lookAt(targetRef.current);
    }
  });

  return null;
}
