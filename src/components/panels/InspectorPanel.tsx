"use client";

import { useSceneStore } from "@/store/sceneStore";
import { useSelectionStore } from "@/store/selectionStore";
import {
  CharacterEntity,
  LightEntity,
  CameraEntity,
  AnimationState,
  SceneEntityUnion,
} from "@/types/entities";

export function InspectorPanel() {
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const entities = useSceneStore((s) => s.document.entities);
  const updateTransform = useSceneStore((s) => s.updateTransform);
  const updateEntity = useSceneStore((s) => s.updateEntity);

  if (selectedIds.length !== 1) {
    return (
      <div className="p-4 text-xs text-zinc-500">
        {selectedIds.length === 0
          ? "No entity selected."
          : `${selectedIds.length} entities selected.`}
      </div>
    );
  }

  const entity = entities[selectedIds[0]];
  if (!entity) return null;

  const { position, rotation, scale } = entity.transform;

  return (
    <div className="p-3 space-y-4 text-sm">
      <Section title="Transform">
        <Vector3Input label="Position" value={position} onChange={(v) => updateTransform(entity.id, { position: v })} step={0.1} />
        <Vector3Input label="Rotation" value={rotation} onChange={(v) => updateTransform(entity.id, { rotation: v })} step={1} />
        <Vector3Input label="Scale" value={scale} onChange={(v) => updateTransform(entity.id, { scale: v })} step={0.1} />
      </Section>

      {entity.type === "character" && (
        <CharacterInspector entity={entity as CharacterEntity} onUpdate={(p) => updateEntity(entity.id, p)} />
      )}

      {entity.type === "light" && (
        <LightInspector entity={entity as LightEntity} onUpdate={(p) => updateEntity(entity.id, p)} />
      )}

      {entity.type === "camera" && (
        <CameraInspector entity={entity as CameraEntity} onUpdate={(p) => updateEntity(entity.id, p)} />
      )}

      {(entity.type === "prop" || entity.type === "courtroom") && (
        <MaterialInspector entity={entity} onUpdate={(p) => updateEntity(entity.id, p)} />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-zinc-400 uppercase mb-2 border-b border-zinc-800 pb-1">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Vector3Input({
  label,
  value,
  onChange,
  step = 0.1,
}: {
  label: string;
  value: { x: number; y: number; z: number };
  onChange: (v: { x: number; y: number; z: number }) => void;
  step?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-400 w-16">{label}</span>
      {(["x", "y", "z"] as const).map((axis) => (
        <input
          key={axis}
          type="number"
          step={step}
          value={Number(value[axis].toFixed(3))}
          onChange={(e) =>
            onChange({ ...value, [axis]: parseFloat(e.target.value) || 0 })
          }
          className="w-16 bg-zinc-800 text-xs rounded px-1.5 py-1 outline-none focus:ring-1 focus:ring-amber-400"
        />
      ))}
    </div>
  );
}

function CharacterInspector({
  entity,
  onUpdate,
}: {
  entity: CharacterEntity;
  onUpdate: (patch: Partial<CharacterEntity>) => void;
}) {
  const animations: AnimationState[] = ["idle", "talking", "walking", "sitting", "pointing"];

  return (
    <Section title="Character">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Role</span>
        <span className="text-xs text-zinc-200 capitalize">{entity.role}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Animation</span>
        <select
          value={entity.animationState}
          onChange={(e) => onUpdate({ animationState: e.target.value as AnimationState })}
          className="bg-zinc-800 text-xs rounded px-2 py-1"
        >
          {animations.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">AI Provider</span>
        <select
          value={entity.aiBinding?.provider ?? ""}
          onChange={(e) =>
            onUpdate({
              aiBinding: { ...entity.aiBinding, provider: (e.target.value || null) as any },
            })
          }
          className="bg-zinc-800 text-xs rounded px-2 py-1"
        >
          <option value="">None</option>
          <option value="vapi">Vapi AI</option>
          <option value="claude">Claude</option>
          <option value="gemini">Gemini</option>
        </select>
      </div>
    </Section>
  );
}

function LightInspector({
  entity,
  onUpdate,
}: {
  entity: LightEntity;
  onUpdate: (patch: Partial<LightEntity>) => void;
}) {
  return (
    <Section title="Light">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Type</span>
        <select
          value={entity.lightType}
          onChange={(e) => onUpdate({ lightType: e.target.value as LightEntity["lightType"] })}
          className="bg-zinc-800 text-xs rounded px-2 py-1"
        >
          {["ambient", "directional", "spot", "point", "hdri"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Color</span>
        <input
          type="color"
          value={entity.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
          className="w-10 h-6 bg-zinc-800 rounded"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Intensity</span>
        <input
          type="number"
          step={0.1}
          value={entity.intensity}
          onChange={(e) => onUpdate({ intensity: parseFloat(e.target.value) || 0 })}
          className="w-20 bg-zinc-800 text-xs rounded px-1.5 py-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Cast Shadow</span>
        <input
          type="checkbox"
          checked={entity.castShadow}
          onChange={(e) => onUpdate({ castShadow: e.target.checked })}
        />
      </div>
    </Section>
  );
}

function CameraInspector({
  entity,
  onUpdate,
}: {
  entity: CameraEntity;
  onUpdate: (patch: Partial<CameraEntity>) => void;
}) {
  return (
    <Section title="Camera">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Role</span>
        <select
          value={entity.role}
          onChange={(e) => onUpdate({ role: e.target.value as CameraEntity["role"] })}
          className="bg-zinc-800 text-xs rounded px-2 py-1"
        >
          {["judge", "defense", "witness", "audience", "free"].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">FOV</span>
        <input
          type="number"
          value={entity.fov}
          onChange={(e) => onUpdate({ fov: parseFloat(e.target.value) || 50 })}
          className="w-20 bg-zinc-800 text-xs rounded px-1.5 py-1"
        />
      </div>
    </Section>
  );
}

function MaterialInspector({
  entity,
  onUpdate,
}: {
  entity: SceneEntityUnion;
  onUpdate: (patch: any) => void;
}) {
  const overrides = (entity as any).materialOverrides?.default ?? {};

  const setOverride = (key: string, value: any) => {
    onUpdate({
      materialOverrides: {
        ...((entity as any).materialOverrides ?? {}),
        default: { ...overrides, [key]: value },
      },
    });
  };

  return (
    <Section title="Material">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Base Color</span>
        <input
          type="color"
          value={overrides.baseColor ?? "#ffffff"}
          onChange={(e) => setOverride("baseColor", e.target.value)}
          className="w-10 h-6 bg-zinc-800 rounded"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Roughness</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={overrides.roughness ?? 0.5}
          onChange={(e) => setOverride("roughness", parseFloat(e.target.value))}
          className="w-24"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Metallic</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={overrides.metallic ?? 0}
          onChange={(e) => setOverride("metallic", parseFloat(e.target.value))}
          className="w-24"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">Emissive</span>
        <input
          type="color"
          value={overrides.emissive ?? "#000000"}
          onChange={(e) => setOverride("emissive", e.target.value)}
          className="w-10 h-6 bg-zinc-800 rounded"
        />
      </div>
    </Section>
  );
}
