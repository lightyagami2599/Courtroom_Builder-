import { SceneEntityUnion } from "./entities";

export interface SceneDocument {
  version: string;
  id: string;
  name: string;
  entities: Record<string, SceneEntityUnion>;
  rootIds: string[]; // top-level entity ids (under "Scene")
  createdAt: string;
  updatedAt: string;
}

export const createEmptySceneDocument = (id: string, name: string): SceneDocument => ({
  version: "1.0.0",
  id,
  name,
  entities: {},
  rootIds: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
