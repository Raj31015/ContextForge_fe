/**
 * Upload a PDF via Next.js API
 */
export async function uploadPdf(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch("/api/documents/upload", {
    method: "POST",
    body: formData
  })

    if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json()
}

