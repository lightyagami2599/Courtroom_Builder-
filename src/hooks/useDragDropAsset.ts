import { nanoid } from "nanoid";
import { useSceneStore } from "@/store/sceneStore";
import { useAssetStore } from "@/store/assetStore";
import {
  SceneEntityUnion,
  CharacterEntity,
  AssetEntity,
  LightEntity,
  CameraEntity,
} from "@/types/entities";

// Note: drag source sets `application/x-asset-id` payload with assetId
export function useDragDropAsset() {
  const addEntity = useSceneStore((s) => s.addEntity);
  const library = useAssetStore((s) => s.library);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const assetId = e.dataTransfer.getData("application/x-asset-id");
    const asset = library.find((a) => a.id === assetId);
    if (!asset) return;

    // Drop position: default to origin grid; refine with raycast in production
    const dropPos = { x: 0, y: 0, z: 0 };

    const baseTransform = {
      position: dropPos,
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    };

    const id = nanoid();
    let entity: SceneEntityUnion;

    if (asset.category === "characters") {
      entity = {
        id,
        name: asset.name,
        type: "character",
        parentId: null,
        transform: baseTransform,
        visible: true,
        locked: false,
        role: (asset.defaultRole ?? "audience") as CharacterEntity["role"],
        assetUrl: asset.modelUrl,
        animationState: "idle",
        aiBinding: { provider: null },
      } satisfies CharacterEntity;
    } else if (asset.category === "lights") {
      entity = {
        id,
        name: asset.name,
        type: "light",
        parentId: null,
        transform: baseTransform,
        visible: true,
        locked: false,
        lightType: "point",
        color: "#ffffff",
        intensity: 1,
        castShadow: true,
      } satisfies LightEntity;
    } else if (asset.category === "cameras") {
      entity = {
        id,
        name: asset.name,
        type: "camera",
        parentId: null,
        transform: baseTransform,
        visible: true,
        locked: false,
        role: "free",
        fov: 50,
        near: 0.1,
        far: 1000,
      } satisfies CameraEntity;
    } else {
      entity = {
        id,
        name: asset.name,
        type: "prop",
        parentId: null,
        transform: baseTransform,
        visible: true,
        locked: false,
        assetUrl: asset.modelUrl,
        lod: asset.lod
          ? { high: asset.modelUrl, medium: asset.lod.medium, low: asset.lod.low }
          : { high: asset.modelUrl },
      } satisfies AssetEntity;
    }

    addEntity(entity, null);
  };

  return { onDrop, onDragOver };
}
