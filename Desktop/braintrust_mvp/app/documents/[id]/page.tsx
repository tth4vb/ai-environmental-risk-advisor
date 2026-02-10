import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { DocumentViewer } from '@/components/documents/document-viewer'
import { ProvenancePanel } from '@/components/provenance/provenance-panel'

interface PageProps {
  params: {
    id: string
  }
}

export default async function DocumentPage({ params }: PageProps) {
  const supabase = createClient()

  const { data: document } = await supabase
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
    .eq('id', params.id)
    .single()

  if (!document) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DocumentViewer document={document} />
        </div>
        <div>
          <ProvenancePanel document={document} />
        </div>
      </div>
    </div>
  )
}
