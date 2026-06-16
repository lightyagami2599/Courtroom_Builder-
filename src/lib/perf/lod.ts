/**
 * LOD distance thresholds (meters from camera).
 * Used by LODModel for distance-based asset swapping.
 */
export const LOD_THRESHOLDS = {
  high: 12,
  medium: 30,
  low: Infinity,
} as const;

/**
 * Frustum culling is handled natively by Three.js per-object via
 * `frustumCulled = true` (default). For instanced crowd (audience),
 * use InstancedMesh + manual frustum checks for >50 characters.
 */
export const PERFORMANCE_CONFIG = {
  maxAudienceInstanced: 50,
  shadowMapSize: 2048,
  enableTextureStreaming: true,
  targetFPS: 60,
};
