export type EntityType =
  | "courtroom"
  | "character"
  | "prop"
  | "light"
  | "camera"
  | "evidence"
  | "group";

export type CharacterRole =
  | "judge"
  | "prosecutor"
  | "defense"
  | "witness"
  | "police"
  | "audience";

export type AnimationState =
  | "idle"
  | "talking"
  | "walking"
  | "sitting"
  | "pointing";

export type LightType =
  | "ambient"
  | "directional"
  | "spot"
  | "point"
  | "hdri";

export type CameraRole =
  | "judge"
  | "defense"
  | "witness"
  | "audience"
  | "free";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface MaterialOverride {
  baseColor?: string;
  roughness?: number;
  metallic?: number;
  normalMapUrl?: string;
  aoMapUrl?: string;
  emissive?: string;
  emissiveIntensity?: number;
}

export interface TransformData {
  position: Vec3;
  rotation: Vec3; // Euler degrees
  scale: Vec3;
}

export interface BaseEntity {
  id: string;
  name: string;
  type: EntityType;
  parentId: string | null;
  transform: TransformData;
  visible: boolean;
  locked: boolean;
}

export interface AssetEntity extends BaseEntity {
  type: "prop" | "courtroom";
  assetUrl: string; // GLB path
  materialOverrides?: Record<string, MaterialOverride>;
  lod?: { high: string; medium?: string; low?: string };
}

export interface CharacterEntity extends BaseEntity {
  type: "character";
  role: CharacterRole;
  assetUrl: string;
  animationState: AnimationState;
  aiBinding?: {
    provider: "vapi" | "claude" | "gemini" | null;
    agentId?: string;
  };
}

export interface LightEntity extends BaseEntity {
  type: "light";
  lightType: LightType;
  color: string;
  intensity: number;
  castShadow: boolean;
  // spot/point specific
  distance?: number;
  angle?: number;
  penumbra?: number;
  decay?: number;
  hdriUrl?: string;
}

export interface CameraEntity extends BaseEntity {
  type: "camera";
  role: CameraRole;
  fov: number;
  near: number;
  far: number;
}

export interface EvidenceEntity extends BaseEntity {
  type: "evidence";
  mediaType: "image" | "pdf" | "video" | "audio" | "model";
  mediaUrl: string;
  displayOnScreenId?: string | null;
}

export interface GroupEntity extends BaseEntity {
  type: "group";
}

export type SceneEntityUnion =
  | AssetEntity
  | CharacterEntity
  | LightEntity
  | CameraEntity
  | EvidenceEntity
  | GroupEntity;
