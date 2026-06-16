import { create } from "zustand";

export type TransformMode = "translate" | "rotate" | "scale";
export type TransformSpace = "world" | "local";

interface SelectionState {
  selectedIds: string[];
  transformMode: TransformMode;
  transformSpace: TransformSpace;
  snapEnabled: boolean;
  snapTranslate: number; // grid size
  snapRotate: number; // degrees
  snapScale: number;

  select: (id: string | null, additive?: boolean) => void;
  clearSelection: () => void;
  setTransformMode: (mode: TransformMode) => void;
  setTransformSpace: (space: TransformSpace) => void;
  toggleSnap: () => void;
  setSnapValues: (vals: Partial<{ translate: number; rotate: number; scale: number }>) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedIds: [],
  transformMode: "translate",
  transformSpace: "world",
  snapEnabled: false,
  snapTranslate: 0.5,
  snapRotate: 15,
  snapScale: 0.1,

  select: (id, additive = false) =>
    set((state) => {
      if (id === null) return { selectedIds: [] };
      if (additive) {
        return state.selectedIds.includes(id)
          ? { selectedIds: state.selectedIds.filter((s) => s !== id) }
          : { selectedIds: [...state.selectedIds, id] };
      }
      return { selectedIds: [id] };
    }),

  clearSelection: () => set({ selectedIds: [] }),
  setTransformMode: (mode) => set({ transformMode: mode }),
  setTransformSpace: (space) => set({ transformSpace: space }),
  toggleSnap: () => set((s) => ({ snapEnabled: !s.snapEnabled })),
  setSnapValues: (vals) =>
    set((state) => ({
      snapTranslate: vals.translate ?? state.snapTranslate,
      snapRotate: vals.rotate ?? state.snapRotate,
      snapScale: vals.scale ?? state.snapScale,
    })),
}));
