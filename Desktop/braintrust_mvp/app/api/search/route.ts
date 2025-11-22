import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ documents: [] })
    }

    // PostgreSQL full-text search
    const { data: documents, error } = await supabase
      .rpc('search_documents', { search_query: query })

    if (error) throw error

    return NextResponse.json({ documents })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
