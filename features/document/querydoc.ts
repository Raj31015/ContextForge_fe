
export interface QueryRequest {
  question: string
  doc_ids?: string[]
}

export interface QueryResponse {
  answer: string
  citations: string[]
  context:string
}

/**
 * Frontend → Next.js proxy wrapper
 */
export async function queryRag(
  payload: QueryRequest
): Promise<QueryResponse> {
  const res = await fetch("/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Query failed: ${text}`)
  }

  return res.json()
}
