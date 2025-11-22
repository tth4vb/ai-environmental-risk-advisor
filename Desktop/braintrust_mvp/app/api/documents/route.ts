import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, tags } = body

    // Insert document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        title,
        content,
        source_type: 'manual_entry',
        uploaded_by: user.id,
        status: 'complete',
      })
      .select()
      .single()

    if (docError) throw docError

    // Insert tags if provided
    if (tags && tags.length > 0) {
      const tagInserts = tags.map((tag: string) => ({
        document_id: document.id,
        tag: tag.toLowerCase().trim(),
      }))

      const { error: tagsError } = await supabase
        .from('document_tags')
        .insert(tagInserts)

      if (tagsError) throw tagsError
    }

    return NextResponse.json({ document })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const { data: documents, error } = await supabase
      .from('documents')
      .select(`
        *,
        users (
          display_name,
          job_title,
          team,
          avatar_url
        ),
        document_tags (
          tag
        )
      `)
      .eq('status', 'complete')
      .order('uploaded_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return NextResponse.json({ documents })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
