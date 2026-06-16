"use client";

import { useTexture, Html } from "@react-three/drei";
import { EvidenceEntity } from "@/types/entities";
import { Suspense } from "react";

/**
 * Renders evidence content onto an in-scene screen mesh.
 * Attach to a "tech-screen" prop entity via displayOnScreenId.
 */
export function EvidenceScreenContent({ evidence }: { evidence: EvidenceEntity }) {
  if (evidence.mediaType === "image") {
    return <ImagePlane url={evidence.mediaUrl} />;
  }

  if (evidence.mediaType === "video") {
    return (
      <Html transform distanceFactor={2} position={[0, 0, 0.06]}>
        <video src={evidence.mediaUrl} controls width={480} />
      </Html>
    );
  }

  if (evidence.mediaType === "pdf") {
    return (
      <Html transform distanceFactor={2} position={[0, 0, 0.06]}>
        <iframe src={evidence.mediaUrl} width={480} height={360} />
      </Html>
    );
  }

  if (evidence.mediaType === "audio") {
    return (
      <Html transform distanceFactor={2} position={[0, 0, 0.06]}>
        <audio src={evidence.mediaUrl} controls />
      </Html>
    );
  }

  return null;
}

function ImagePlane({ url }: { url: string }) {
  const texture = useTexture(url);
  return (
    <Suspense fallback={null}>
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.6, 0.9]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </Suspense>
  );
}
