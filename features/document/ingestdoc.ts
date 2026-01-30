export async function ingestDocument(docId: string, filename: string) {
  const res = await fetch("/api/documents/ingest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ docId, filename })
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res.json()
}
