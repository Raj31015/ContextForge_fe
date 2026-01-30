import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export const runtime = "nodejs" // IMPORTANT for file uploads

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      )
    }

    const docId = crypto.randomUUID()
    const path = `pdfs/${docId}.pdf`

    // Convert File → ArrayBuffer → Uint8Array
    const buffer = new Uint8Array(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from("ContextForge")
      .upload(path, buffer, {
        contentType: "application/pdf",
        upsert: false
      })

    if (uploadError) {
      console.error(uploadError)
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: "uploaded",
      docId,
      filename: file.name
    })
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err)
    return NextResponse.json(
      { error: err.message ?? "unknown error" },
      { status: 500 }
    )
  }
}
