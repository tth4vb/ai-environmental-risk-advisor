import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getFileExtension } from '@/lib/document-processing'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const tags = formData.get('tags') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Get file extension
    const fileExt = getFileExtension(file.name)
    const fileType = fileExt

    // Upload to Supabase Storage
    const filePath = `${user.id}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath)

    // Create document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        title: title || file.name,
        source_type: 'file_upload',
        file_type: fileType,
        file_url: publicUrl,
        uploaded_by: user.id,
        status: 'processing',
      })
      .select()
      .single()

    if (docError) throw docError

    // Insert tags if provided
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t)
      if (tagArray.length > 0) {
        const tagInserts = tagArray.map(tag => ({
          document_id: document.id,
          tag: tag.toLowerCase(),
        }))
        await supabase.from('document_tags').insert(tagInserts)
      }
    }

    return NextResponse.json({ document })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
