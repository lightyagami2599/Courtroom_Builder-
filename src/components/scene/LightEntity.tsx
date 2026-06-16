"use client";

import { LightEntity as LightEntityType } from "@/types/entities";
import { Environment } from "@react-three/drei";

export function LightEntity({ entity }: { entity: LightEntityType }) {
  const { lightType, color, intensity, castShadow, distance, angle, penumbra, decay, hdriUrl } = entity;

  switch (lightType) {
    case "ambient":
      return <ambientLight color={color} intensity={intensity} />;
    case "directional":
      return (
        <directionalLight
          color={color}
          intensity={intensity}
          castShadow={castShadow}
          shadow-mapSize={[2048, 2048]}
        />
      );
    case "point":
      return (
        <pointLight
          color={color}
          intensity={intensity}
          distance={distance ?? 0}
          decay={decay ?? 2}
          castShadow={castShadow}
        />
      );
    case "spot":
      return (
        <spotLight
          color={color}
          intensity={intensity}
          distance={distance ?? 0}
          angle={angle ?? Math.PI / 6}
          penumbra={penumbra ?? 0.3}
          decay={decay ?? 2}
          castShadow={castShadow}
        />
      );
    case "hdri":
      return hdriUrl ? <Environment files={hdriUrl} background /> : null;
    default:
      return null;
  }
}
