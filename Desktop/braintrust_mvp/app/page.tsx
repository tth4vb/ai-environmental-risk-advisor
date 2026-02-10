import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DocumentCard } from '@/components/documents/document-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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
    .limit(12)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Ask the Braintrust</h1>
          <p className="text-gray-600 mb-6">
            Your organization's collective knowledge, searchable and trustworthy
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/add">Add to Braintrust</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/map">View the Braintrust</Link>
            </Button>
          </div>
        </div>

        {/* Recent Documents */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Knowledge</h2>
          {documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No documents yet. Be the first to add knowledge!</p>
              <Button asChild className="mt-4">
                <Link href="/add">Add Your First Document</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
