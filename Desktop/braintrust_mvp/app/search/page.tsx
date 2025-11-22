import { createClient } from '@/lib/supabase/server'
import { DocumentCard } from '@/components/documents/document-card'
import { SearchBar } from '@/components/search/search-bar'

interface PageProps {
  searchParams: {
    q?: string
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q || ''
  const supabase = createClient()

  let documents = []

  if (query) {
    const { data } = await supabase.rpc('search_documents', {
      search_query: query,
    })

    if (data) {
      // Fetch user and tags for each document
      const docsWithDetails = await Promise.all(
        data.map(async (doc: any) => {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', doc.uploaded_by)
            .single()

          const { data: tags } = await supabase
            .from('document_tags')
            .select('tag')
            .eq('document_id', doc.id)

          return {
            ...doc,
            users: userData,
            document_tags: tags || [],
          }
        })
      )

      documents = docsWithDetails
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar />
      </div>

      {query && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Results for "{query}"
          </h2>
          <p className="text-gray-500">{documents.length} documents found</p>
        </div>
      )}

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12 text-gray-500">
          <p>No results found for "{query}"</p>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Enter a search query to find knowledge</p>
        </div>
      )}
    </div>
  )
}
