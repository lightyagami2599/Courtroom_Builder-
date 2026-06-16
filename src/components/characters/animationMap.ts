import { AnimationState } from "@/types/entities";

// Maps editor animation state -> GLB clip name convention
export const ANIMATION_CLIP_NAMES: Record<AnimationState, string> = {
  idle: "Idle",
  talking: "Talking",
  walking: "Walking",
  sitting: "Sitting",
  pointing: "Pointing",
};
