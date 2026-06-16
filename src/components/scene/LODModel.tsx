"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useState, useRef } from "react";
import { Group } from "three";
import { AssetEntity } from "@/types/entities";

export function LODModel({ entity, selected }: { entity: AssetEntity; selected: boolean }) {
  const [currentLOD, setCurrentLOD] = useState<"high" | "medium" | "low">("high");
  const groupRef = useRef<Group>(null);
  const { camera } = useThree();

  const url =
    currentLOD === "high"
      ? entity.lod?.high ?? entity.assetUrl
      : currentLOD === "medium"
      ? entity.lod?.medium ?? entity.lod?.high ?? entity.assetUrl
      : entity.lod?.low ?? entity.lod?.medium ?? entity.assetUrl;

  const { scene } = useGLTF(url);

  // Distance-based LOD switching
  useFrame(() => {
    if (!groupRef.current) return;
    const distance = camera.position.distanceTo(groupRef.current.getWorldPosition(groupRef.current.position.clone()));

    if (distance > 30 && entity.lod?.low && currentLOD !== "low") {
      setCurrentLOD("low");
    } else if (distance > 12 && distance <= 30 && entity.lod?.medium && currentLOD !== "medium") {
      setCurrentLOD("medium");
    } else if (distance <= 12 && currentLOD !== "high") {
      setCurrentLOD("high");
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene.clone()} />
      {selected && (
        <mesh>
          <boxGeometry args={[1.05, 1.05, 1.05]} />
          <meshBasicMaterial color="#fbbf24" wireframe />
        </mesh>
      )}
    </group>
  );
}
