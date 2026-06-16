"use client";

import { useMemo, useState } from "react";
import { useSceneStore } from "@/store/sceneStore";
import { useSelectionStore } from "@/store/selectionStore";
import { SceneEntityUnion } from "@/types/entities";

interface TreeNode {
  entity: SceneEntityUnion;
  children: TreeNode[];
}

function buildTree(entities: Record<string, SceneEntityUnion>, rootIds: string[]): TreeNode[] {
  const buildNode = (id: string): TreeNode => {
    const entity = entities[id];
    const children = Object.values(entities)
      .filter((e) => e.parentId === id)
      .map((e) => buildNode(e.id));
    return { entity, children };
  };
  return rootIds.map(buildNode);
}

export function HierarchyPanel() {
  const { document, removeEntity, renameEntity, duplicateEntity, groupEntities, toggleVisibility, toggleLock } =
    useSceneStore();
  const { selectedIds, select } = useSelectionStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  const tree = useMemo(
    () => buildTree(document.entities, document.rootIds),
    [document.entities, document.rootIds]
  );

  const handleGroup = () => {
    if (selectedIds.length > 1) {
      groupEntities(selectedIds, "New Group");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b border-zinc-800">
        <span className="text-xs font-semibold text-zinc-400 uppercase">Scene</span>
        <button
          onClick={handleGroup}
          disabled={selectedIds.length < 2}
          className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40"
        >
          Group
        </button>
      </div>
      <div className="overflow-y-auto flex-1 p-1">
        {tree.map((node) => (
          <TreeRow
            key={node.entity.id}
            node={node}
            depth={0}
            selectedIds={selectedIds}
            editingId={editingId}
            onSelect={select}
            onRename={(id, name) => {
              renameEntity(id, name);
              setEditingId(null);
            }}
            onStartEdit={setEditingId}
            onDelete={removeEntity}
            onDuplicate={duplicateEntity}
            onToggleVisibility={toggleVisibility}
            onToggleLock={toggleLock}
          />
        ))}
      </div>
    </div>
  );
}

function TreeRow({
  node,
  depth,
  selectedIds,
  editingId,
  onSelect,
  onRename,
  onStartEdit,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onToggleLock,
}: {
  node: TreeNode;
  depth: number;
  selectedIds: string[];
  editingId: string | null;
  onSelect: (id: string, additive?: boolean) => void;
  onRename: (id: string, name: string) => void;
  onStartEdit: (id: string | null) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => string | null;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
}) {
  const { entity, children } = node;
  const isSelected = selectedIds.includes(entity.id);
  const isEditing = editingId === entity.id;

  return (
    <div>
      <div
        onClick={(e) => onSelect(entity.id, e.shiftKey || e.metaKey || e.ctrlKey)}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        className={`group flex items-center gap-1 py-1 pr-1 rounded cursor-pointer text-sm ${
          isSelected ? "bg-amber-400/20 text-amber-300" : "hover:bg-zinc-800 text-zinc-300"
        }`}
      >
        <EntityIcon type={entity.type} />
        {isEditing ? (
          <input
            autoFocus
            defaultValue={entity.name}
            onBlur={(e) => onRename(entity.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onRename(entity.id, (e.target as HTMLInputElement).value);
              if (e.key === "Escape") onStartEdit(null);
            }}
            className="bg-zinc-700 text-xs px-1 rounded flex-1 outline-none"
          />
        ) : (
          <span
            onDoubleClick={() => onStartEdit(entity.id)}
            className="flex-1 truncate text-xs"
          >
            {entity.name}
          </span>
        )}

        <div className="hidden group-hover:flex items-center gap-1 text-[10px] text-zinc-500">
          <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(entity.id); }} title="Toggle visibility">
            {entity.visible ? "👁" : "🚫"}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onToggleLock(entity.id); }} title="Toggle lock">
            {entity.locked ? "🔒" : "🔓"}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(entity.id); }} title="Duplicate">
            ⧉
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(entity.id); }} title="Delete">
            ✕
          </button>
        </div>
      </div>
      {children.map((child) => (
        <TreeRow
          key={child.entity.id}
          node={child}
          depth={depth + 1}
          selectedIds={selectedIds}
          editingId={editingId}
          onSelect={onSelect}
          onRename={onRename}
          onStartEdit={onStartEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onToggleVisibility={onToggleVisibility}
          onToggleLock={onToggleLock}
        />
      ))}
    </div>
  );
}

function EntityIcon({ type }: { type: SceneEntityUnion["type"] }) {
  const icons: Record<SceneEntityUnion["type"], string> = {
    courtroom: "🏛",
    character: "🧍",
    prop: "📦",
    light: "💡",
    camera: "🎥",
    evidence: "🗂",
    group: "📁",
  };
  return <span className="text-xs">{icons[type]}</span>;
}
