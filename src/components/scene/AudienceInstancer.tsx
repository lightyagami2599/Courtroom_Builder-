"use client";

import { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, Matrix4, BufferGeometry, Material } from "three";

interface AudienceMember {
  position: [number, number, number];
  rotationY: number;
}

interface AudienceInstancerProps {
  url: string;
  members: AudienceMember[];
}

/**
 * Renders large audience crowds efficiently using Three.js InstancedMesh.
 * Supports up to PERFORMANCE_CONFIG.maxAudienceInstanced members at 60fps.
 *
 * Usage:
 *   <AudienceInstancer
 *     url="/assets/models/characters/audience.glb"
 *     members={[
 *       { position: [1, 0, 2], rotationY: Math.PI },
 *       { position: [-1, 0, 2], rotationY: Math.PI },
 *     ]}
 *   />
 */
export function AudienceInstancer({ url, members }: AudienceInstancerProps) {
  const { nodes } = useGLTF(url) as any;
  const meshRef = useRef<InstancedMesh>(null);

  const matrices = useMemo(() => {
    return members.map((m) => {
      const matrix = new Matrix4();
      matrix.makeRotationY(m.rotationY);
      matrix.setPosition(...m.position);
      return matrix;
    });
  }, [members]);

  useFrame(() => {
    if (!meshRef.current) return;
    matrices.forEach((matrix, i) => meshRef.current!.setMatrixAt(i, matrix));
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Assumes a single primary mesh in the GLB for the audience body
  const primaryNode = Object.values(nodes)[0] as any;
  const geometry: BufferGeometry | undefined = primaryNode?.geometry;
  const material: Material | undefined = primaryNode?.material;

  if (!geometry || !material) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, members.length]}
      castShadow
      receiveShadow
    />
  );
}
