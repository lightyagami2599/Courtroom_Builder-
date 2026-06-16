export interface PBRMaterialConfig {
  baseColor: string;
  roughness: number;
  metallic: number;
  normalMapUrl?: string;
  aoMapUrl?: string;
  emissive: string;
  emissiveIntensity: number;
}

export const DEFAULT_MATERIAL: PBRMaterialConfig = {
  baseColor: "#ffffff",
  roughness: 0.5,
  metallic: 0,
  emissive: "#000000",
  emissiveIntensity: 0,
};
