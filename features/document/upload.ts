import { supabase } from "@/lib/supabase"

export async function uploadPdf(file: File) {
  const docId = crypto.randomUUID()
  const path = `pdfs/${docId}.pdf`

  const { error } = await supabase.storage
    .from("ContextForge")
    .upload(path, file)

  if (error) {
    throw new Error(error.message)
  }

  return {
    docId,
    filename: file.name
  }
}