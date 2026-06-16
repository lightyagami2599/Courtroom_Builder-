"use client";

import { useRef, useMemo } from "react";
import { Group } from "three";
import { useSceneStore } from "@/store/sceneStore";
import { useSelectionStore } from "@/store/selectionStore";
import { TransformGizmo } from "@/components/transform/TransformGizmo";
import { LightEntity as LightEntityComp } from "./LightEntity";
import { CharacterController } from "@/components/characters/CharacterController";
import { LODModel } from "@/components/scene/LODModel";
import { CharacterEntity, AssetEntity } from "@/types/entities";

export function SceneEntity({ entityId }: { entityId: string }) {
  const entity = useSceneStore((s) => s.document.entities[entityId]);
  const entities = useSceneStore((s) => s.document.entities);
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const select = useSelectionStore((s) => s.select);
  const groupRef = useRef<Group>(null);

  const children = useMemo(
    () => Object.values(entities).filter((e) => e.parentId === entityId && e.visible),
    [entities, entityId]
  );

  if (!entity) return null;

  const isSelected = selectedIds.includes(entityId);
  const { position, rotation, scale } = entity.transform;

  const handleClick = (e: any) => {
    e.stopPropagation();
    select(entityId, e.shiftKey || e.metaKey || e.ctrlKey);
  };

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      rotation={[
        (rotation.x * Math.PI) / 180,
        (rotation.y * Math.PI) / 180,
        (rotation.z * Math.PI) / 180,
      ]}
      scale={[scale.x, scale.y, scale.z]}
      onClick={handleClick}
    >
      {entity.type === "character" && (
        <CharacterController entity={entity as CharacterEntity} selected={isSelected} />
      )}

      {(entity.type === "prop" || entity.type === "courtroom") && (
        <LODModel entity={entity as AssetEntity} selected={isSelected} />
      )}

      {entity.type === "light" && <LightEntityComp entity={entity} />}

      {entity.type === "evidence" && (
        <mesh>
          <boxGeometry args={[1, 0.6, 0.05]} />
          <meshStandardMaterial color={isSelected ? "#fbbf24" : "#1e3a8a"} />
        </mesh>
      )}

      {entity.type === "group" && isSelected && (
        <axesHelper args={[1]} />
      )}

      {isSelected && groupRef.current && (
        <TransformGizmo target={groupRef.current} entityId={entityId} />
      )}

      {/* Render children recursively (group hierarchy) */}
      {children.map((child) => (
        <SceneEntity key={child.id} entityId={child.id} />
      ))}
    </group>
  );
}
