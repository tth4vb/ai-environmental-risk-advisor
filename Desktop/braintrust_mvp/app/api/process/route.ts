import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { extractText } from '@/lib/document-processing'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentId } = await request.json()

    // Get document
    const { data: document } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (!document || !document.file_url) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Download file from storage
    const filePath = document.file_url.split('/documents/')[1]
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(filePath)

    if (downloadError) throw downloadError

    // Convert to buffer
    const buffer = Buffer.from(await fileData.arrayBuffer())

    // Extract text
    const content = await extractText(buffer, document.file_type || '')

    // Update document with extracted content
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        content,
        status: 'complete',
      })
      .eq('id', documentId)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    // Mark document as failed
    const { documentId } = await request.json()
    const supabase = createClient()
    await supabase
      .from('documents')
      .update({ status: 'failed' })
      .eq('id', documentId)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
