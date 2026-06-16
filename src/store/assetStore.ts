import { create } from "zustand";

export type AssetCategory =
  | "characters"
  | "furniture"
  | "tech"
  | "lights"
  | "cameras"
  | "evidence";

export interface AssetDefinition {
  id: string;
  name: string;
  category: AssetCategory;
  thumbnailUrl: string;
  modelUrl: string; // GLB
  lod?: { medium?: string; low?: string };
  defaultRole?: string; // for characters: judge/prosecutor/etc.
  tags: string[];
}

interface AssetState {
  library: AssetDefinition[];
  searchQuery: string;
  activeCategory: AssetCategory | "all";
  setSearchQuery: (q: string) => void;
  setActiveCategory: (cat: AssetCategory | "all") => void;
  registerAssets: (assets: AssetDefinition[]) => void;
}

export const useAssetStore = create<AssetState>((set) => ({
  library: [],
  searchQuery: "",
  activeCategory: "all",
  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  registerAssets: (assets) =>
    set((state) => ({ library: [...state.library, ...assets] })),
}));
