import { create } from "zustand";
import { nanoid } from "nanoid";
import {
  SceneDocument,
  createEmptySceneDocument,
} from "@/types/scene";
import { SceneEntityUnion, TransformData } from "@/types/entities";

interface SceneState {
  document: SceneDocument;
  // CRUD
  addEntity: (entity: SceneEntityUnion, parentId?: string | null) => void;
  removeEntity: (id: string) => void;
  renameEntity: (id: string, name: string) => void;
  duplicateEntity: (id: string) => string | null;
  updateTransform: (id: string, transform: Partial<TransformData>) => void;
  updateEntity: <T extends SceneEntityUnion>(id: string, patch: Partial<T>) => void;
  reparentEntity: (id: string, newParentId: string | null, index?: number) => void;
  groupEntities: (ids: string[], groupName?: string) => string;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;
  loadDocument: (doc: SceneDocument) => void;
  resetScene: () => void;
}

const defaultTransform = (): TransformData => ({
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
});

export const useSceneStore = create<SceneState>((set, get) => ({
  document: createEmptySceneDocument(nanoid(), "Untitled Courtroom Scene"),

  addEntity: (entity, parentId = null) =>
    set((state) => {
      const entities = { ...state.document.entities };
      const finalEntity = { ...entity, parentId };
      entities[entity.id] = finalEntity as SceneEntityUnion;

      let rootIds = state.document.rootIds;
      if (!parentId) {
        rootIds = [...rootIds, entity.id];
      }

      return {
        document: {
          ...state.document,
          entities,
          rootIds,
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  removeEntity: (id) =>
    set((state) => {
      const entities = { ...state.document.entities };
      const idsToRemove = new Set<string>();
      const collect = (targetId: string) => {
        idsToRemove.add(targetId);
        Object.values(entities).forEach((e) => {
          if (e.parentId === targetId) collect(e.id);
        });
      };
      collect(id);
      idsToRemove.forEach((rid) => delete entities[rid]);

      return {
        document: {
          ...state.document,
          entities,
          rootIds: state.document.rootIds.filter((rid) => !idsToRemove.has(rid)),
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  renameEntity: (id, name) =>
    set((state) => ({
      document: {
        ...state.document,
        entities: {
          ...state.document.entities,
          [id]: { ...state.document.entities[id], name },
        },
        updatedAt: new Date().toISOString(),
      },
    })),

  duplicateEntity: (id) => {
    const state = get();
    const original = state.document.entities[id];
    if (!original) return null;

    const newId = nanoid();
    const clone: SceneEntityUnion = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      name: `${original.name} (Copy)`,
      transform: {
        ...original.transform,
        position: {
          ...original.transform.position,
          x: original.transform.position.x + 0.5,
        },
      },
    };

    set((s) => ({
      document: {
        ...s.document,
        entities: { ...s.document.entities, [newId]: clone },
        rootIds: clone.parentId
          ? s.document.rootIds
          : [...s.document.rootIds, newId],
        updatedAt: new Date().toISOString(),
      },
    }));

    return newId;
  },

  updateTransform: (id, transform) =>
    set((state) => {
      const entity = state.document.entities[id];
      if (!entity) return state;
      return {
        document: {
          ...state.document,
          entities: {
            ...state.document.entities,
            [id]: {
              ...entity,
              transform: {
                position: { ...entity.transform.position, ...transform.position },
                rotation: { ...entity.transform.rotation, ...transform.rotation },
                scale: { ...entity.transform.scale, ...transform.scale },
              },
            },
          },
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  updateEntity: (id, patch) =>
    set((state) => {
      const entity = state.document.entities[id];
      if (!entity) return state;
      return {
        document: {
          ...state.document,
          entities: {
            ...state.document.entities,
            [id]: { ...entity, ...patch },
          },
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  reparentEntity: (id, newParentId) =>
    set((state) => {
      const entity = state.document.entities[id];
      if (!entity) return state;

      let rootIds = state.document.rootIds.filter((rid) => rid !== id);
      if (!newParentId) {
        rootIds = [...rootIds, id];
      }

      return {
        document: {
          ...state.document,
          entities: {
            ...state.document.entities,
            [id]: { ...entity, parentId: newParentId },
          },
          rootIds,
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  groupEntities: (ids, groupName = "Group") => {
    const groupId = nanoid();
    set((state) => {
      const groupEntity: SceneEntityUnion = {
        id: groupId,
        name: groupName,
        type: "group",
        parentId: null,
        transform: defaultTransform(),
        visible: true,
        locked: false,
      };

      const entities = { ...state.document.entities, [groupId]: groupEntity };
      ids.forEach((id) => {
        if (entities[id]) entities[id] = { ...entities[id], parentId: groupId };
      });

      return {
        document: {
          ...state.document,
          entities,
          rootIds: [
            ...state.document.rootIds.filter((rid) => !ids.includes(rid)),
            groupId,
          ],
          updatedAt: new Date().toISOString(),
        },
      };
    });
    return groupId;
  },

  toggleVisibility: (id) =>
    set((state) => {
      const entity = state.document.entities[id];
      if (!entity) return state;
      return {
        document: {
          ...state.document,
          entities: {
            ...state.document.entities,
            [id]: { ...entity, visible: !entity.visible },
          },
        },
      };
    }),

  toggleLock: (id) =>
    set((state) => {
      const entity = state.document.entities[id];
      if (!entity) return state;
      return {
        document: {
          ...state.document,
          entities: {
            ...state.document.entities,
            [id]: { ...entity, locked: !entity.locked },
          },
        },
      };
    }),

  loadDocument: (doc) => set({ document: doc }),

  resetScene: () =>
    set({ document: createEmptySceneDocument(nanoid(), "Untitled Courtroom Scene") }),
}));
