import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DocumentCard } from '@/components/documents/document-card'
import { Badge } from '@/components/ui/badge'

export default async function BrowsePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get all tags with counts
  const { data: tagData } = await supabase
    .from('document_tags')
    .select('tag')

  const tagCounts = tagData?.reduce((acc, { tag }) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const tags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)

  // Get recent documents
  const { data: documents } = await supabase
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
    .limit(20)

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Browse Knowledge</h1>

      {/* Tags Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(([tag, count]) => (
            <Badge key={tag} variant="secondary" className="text-sm">
              {tag} ({count})
            </Badge>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
        {documents && documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No documents yet</p>
        )}
      </div>
    </div>
  )
}
