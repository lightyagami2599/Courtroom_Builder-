import { SceneDocument } from "@/types/scene";
import { supabase } from "@/lib/supabase/client";

export function exportSceneAsJSON(doc: SceneDocument) {
  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement("a");
  a.href = url;
  a.download = `${doc.name.replace(/\s+/g, "_")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function saveSceneToSupabase(doc: SceneDocument) {
  const { error } = await supabase
    .from("courtroom_scenes")
    .upsert({
      id: doc.id,
      name: doc.name,
      data: doc,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Failed to save scene:", error.message);
    throw error;
  }
  return true;
}

export async function fetchSceneFromSupabase(id: string): Promise<SceneDocument | null> {
  const { data, error } = await supabase
    .from("courtroom_scenes")
    .select("data")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch scene:", error.message);
    return null;
  }
  return data?.data as SceneDocument;
}
