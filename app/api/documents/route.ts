import {supabase} from '@/lib/supabase'
export async function GET() {
   const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  
  return Response.json(data)
}
