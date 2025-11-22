import { ContributorNode } from './contributor-node'

interface Contributor {
  id: string
  display_name: string
  job_title: string | null
  team: string | null
  document_count: number
}

interface KnowledgeMapProps {
  contributors: Contributor[]
}

export function KnowledgeMap({ contributors }: KnowledgeMapProps) {
  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">The Braintrust</h2>
        <p className="text-gray-600">
          {contributors.length} {contributors.length === 1 ? 'contributor' : 'contributors'} sharing knowledge
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {contributors.map((contributor) => (
          <ContributorNode
            key={contributor.id}
            user={contributor}
            documentCount={contributor.document_count}
          />
        ))}
      </div>
    </div>
  )
}
