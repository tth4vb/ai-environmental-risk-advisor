import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ContributorNodeProps {
  user: {
    id: string
    display_name: string
    job_title: string | null
    team: string | null
  }
  documentCount: number
}

export function ContributorNode({ user, documentCount }: ContributorNodeProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">
            {user.display_name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{user.display_name}</h3>
          {user.job_title && (
            <p className="text-sm text-gray-500">{user.job_title}</p>
          )}
          {user.team && (
            <p className="text-sm text-gray-500">{user.team}</p>
          )}
        </div>
        <Badge variant="secondary">
          {documentCount} {documentCount === 1 ? 'document' : 'documents'}
        </Badge>
      </CardContent>
    </Card>
  )
}
