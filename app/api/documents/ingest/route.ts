import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
export async function POST(req: Request) {
  try {
    const { docId, filename } = await req.json()

    if (!docId || !filename) {
      return NextResponse.json(
        { error: "docId and filename required" },
        { status: 400 }
      )
    }

    const path = `pdfs/${docId}.pdf`

    // 1️⃣ Create signed URL (file MUST exist)
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(path, 600)

    console.log("SIGNED URL DATA:", data)
  console.log("SIGNED URL ERROR:", error)
    if (error || !data) {
      return NextResponse.json(
        { error: "File not found in storage" },
        { status: 400 }
      )
    }

    // 2️⃣ Call Python backend
    await fetch(`${process.env.PY_BACKEND_URL}/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doc_id: docId,
        signed_url: data.signedUrl,
        filename
      })
    })

    return NextResponse.json({ status: "queued" })
  } catch (err: any) {
    console.error("INGEST ERROR:", err)
    return NextResponse.json(
      { error: err.message ?? "unknown error" },
      { status: 500 }
    )
  }
}