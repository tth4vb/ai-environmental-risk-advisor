import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { KnowledgeMap } from '@/components/knowledge-map/knowledge-map'

export default async function MapPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get all users with their document counts
  const { data: users } = await supabase
    .from('users')
    .select('*')

  const { data: documents } = await supabase
    .from('documents')
    .select('uploaded_by')
    .eq('status', 'complete')

  // Count documents per user
  const documentCounts = documents?.reduce((acc, doc) => {
    acc[doc.uploaded_by] = (acc[doc.uploaded_by] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const contributors = users
    ?.filter(u => documentCounts[u.id] > 0)
    .map(u => ({
      ...u,
      document_count: documentCounts[u.id] || 0,
    }))
    .sort((a, b) => b.document_count - a.document_count) || []

  return (
    <div className="container mx-auto py-8 px-4">
      <KnowledgeMap contributors={contributors} />
    </div>
  )
}
