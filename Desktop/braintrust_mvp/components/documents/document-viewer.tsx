import type { Document } from '@/lib/types/database'

interface DocumentViewerProps {
  document: Document
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  return (
    <div className="prose max-w-none">
      <h1>{document.title}</h1>
      <div className="whitespace-pre-wrap">{document.content}</div>
    </div>
  )
}
