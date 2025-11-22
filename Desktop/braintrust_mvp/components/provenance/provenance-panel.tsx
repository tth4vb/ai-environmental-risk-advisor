import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DocumentWithTags } from '@/lib/types/database'

interface ProvenancePanelProps {
  document: DocumentWithTags
}

export function ProvenancePanel({ document }: ProvenancePanelProps) {
  const user = document.users
  const uploadDate = new Date(document.uploaded_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const sourceTypeLabels = {
    file_upload: 'Uploaded File',
    manual_entry: 'Manual Entry',
    survey: 'Survey Response',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Provenance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contributor */}
        <div className="flex items-start space-x-3">
          <Avatar>
            <AvatarFallback>
              {user?.display_name?.split(' ').map(n => n[0]).join('') || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{user?.display_name || 'Unknown'}</p>
            {user?.job_title && (
              <p className="text-sm text-gray-500">{user.job_title}</p>
            )}
            {user?.team && (
              <p className="text-sm text-gray-500">{user.team}</p>
            )}
          </div>
        </div>

        {/* Upload Info */}
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Added on {uploadDate}</p>
          <p className="text-sm text-gray-500">
            Source: {sourceTypeLabels[document.source_type]}
          </p>
          {document.file_type && (
            <p className="text-sm text-gray-500">
              Type: {document.file_type.toUpperCase()}
            </p>
          )}
        </div>

        {/* Tags */}
        {document.document_tags && document.document_tags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Tags</p>
            <div className="flex flex-wrap gap-2">
              {document.document_tags.map(({ tag }) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
