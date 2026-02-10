import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DocumentWithTags } from '@/lib/types/database'

interface DocumentCardProps {
  document: DocumentWithTags
}

export function DocumentCard({ document }: DocumentCardProps) {
  const user = document.users
  const snippet = document.content?.slice(0, 150) + (document.content && document.content.length > 150 ? '...' : '')

  return (
    <Link href={`/documents/${document.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg">{document.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">{snippet}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {user?.display_name?.split(' ').map(n => n[0]).join('') || '?'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-500">{user?.display_name}</span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(document.uploaded_at).toLocaleDateString()}
            </span>
          </div>

          {document.document_tags && document.document_tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {document.document_tags.slice(0, 3).map(({ tag }) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
