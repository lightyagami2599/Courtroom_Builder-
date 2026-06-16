import { nanoid } from "nanoid";
import { useSceneStore } from "@/store/sceneStore";
import { EvidenceEntity } from "@/types/entities";
import { supabase } from "@/lib/supabase/client";

const MEDIA_TYPE_MAP: Record<string, EvidenceEntity["mediaType"]> = {
  "image/": "image",
  "application/pdf": "pdf",
  "video/": "video",
  "audio/": "audio",
  "model/gltf-binary": "model",
};

function detectMediaType(mime: string): EvidenceEntity["mediaType"] {
  for (const [prefix, type] of Object.entries(MEDIA_TYPE_MAP)) {
    if (mime.startsWith(prefix)) return type;
  }
  return "image";
}

export function useEvidenceUpload() {
  const addEntity = useSceneStore((s) => s.addEntity);

  const uploadEvidence = async (file: File, displayOnScreenId?: string) => {
    const path = `evidence/${nanoid()}-${file.name}`;
    const { error } = await supabase.storage.from("courtroom-evidence").upload(path, file);
    if (error) throw error;

    const { data: urlData } = supabase.storage.from("courtroom-evidence").getPublicUrl(path);

    const entity: EvidenceEntity = {
      id: nanoid(),
      name: file.name,
      type: "evidence",
      parentId: null,
      transform: {
        position: { x: 0, y: 1.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      visible: true,
      locked: false,
      mediaType: detectMediaType(file.type),
      mediaUrl: urlData.publicUrl,
      displayOnScreenId: displayOnScreenId ?? null,
    };

    addEntity(entity, null);
    return entity;
  };

  return { uploadEvidence };
}
