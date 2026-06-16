"use client";

import { TransformControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Object3D } from "three";
import { useSelectionStore } from "@/store/selectionStore";
import { useSceneStore } from "@/store/sceneStore";

interface TransformGizmoProps {
  target: Object3D | null;
  entityId: string;
}

export function TransformGizmo({ target, entityId }: TransformGizmoProps) {
  const { transformMode, transformSpace, snapEnabled, snapTranslate, snapRotate, snapScale } =
    useSelectionStore();
  const updateTransform = useSceneStore((s) => s.updateTransform);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleChange = () => {
      if (!target) return;
      updateTransform(entityId, {
        position: { x: target.position.x, y: target.position.y, z: target.position.z },
        rotation: {
          x: (target.rotation.x * 180) / Math.PI,
          y: (target.rotation.y * 180) / Math.PI,
          z: (target.rotation.z * 180) / Math.PI,
        },
        scale: { x: target.scale.x, y: target.scale.y, z: target.scale.z },
      });
    };

    controls.addEventListener("objectChange", handleChange);
    return () => controls.removeEventListener("objectChange", handleChange);
  }, [target, entityId, updateTransform]);

  if (!target) return null;

  return (
    <TransformControls
      ref={controlsRef}
      object={target}
      mode={transformMode}
      space={transformSpace}
      translationSnap={snapEnabled ? snapTranslate : null}
      rotationSnap={snapEnabled ? (snapRotate * Math.PI) / 180 : null}
      scaleSnap={snapEnabled ? snapScale : null}
    />
  );
}
