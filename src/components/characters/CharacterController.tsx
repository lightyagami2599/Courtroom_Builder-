"use client";

import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";
import { CharacterEntity } from "@/types/entities";
import { ANIMATION_CLIP_NAMES } from "./animationMap";

interface CharacterControllerProps {
  entity: CharacterEntity;
  selected: boolean;
}

export function CharacterController({ entity, selected }: CharacterControllerProps) {
  const groupRef = useRef<Group>(null);
  const { scene, animations } = useGLTF(entity.assetUrl);
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    const clipName = ANIMATION_CLIP_NAMES[entity.animationState];
    const action = actions[clipName];

    if (!action) return;

    // Crossfade from any currently playing action
    Object.values(actions).forEach((a) => {
      if (a && a !== action && a.isRunning()) {
        a.fadeOut(0.3);
      }
    });

    action.reset().fadeIn(0.3).play();

    return () => {
      action.fadeOut(0.3);
    };
  }, [actions, entity.animationState]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      {selected && (
        <mesh position={[0, 1, 0]}>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      )}
    </group>
  );
}

/**
 * FUTURE INTEGRATION HOOKS:
 *
 * - Vapi AI: subscribe to voice activity -> set entity.animationState = "talking"
 *   while audio is active, fallback to "idle" on silence.
 *
 * - Claude/Gemini AI: dialogue responses trigger animationState transitions
 *   based on semantic cues (e.g. argument -> "pointing", testimony -> "talking").
 *
 * - Lip Sync: bind viseme blend shapes (morph targets) to TTS phoneme timing.
 *   Requires GLB with ARKit-compatible morph targets on head mesh.
 *
 * - Facial Animation: drive expression morph targets via emotion classifier
 *   output from AI response sentiment.
 */
