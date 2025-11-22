'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function FileUploadZone() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      // Upload file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('tags', tags)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json()
        throw new Error(data.error || 'Upload failed')
      }

      const { document } = await uploadResponse.json()

      // Trigger processing
      await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: document.id }),
      })

      router.push(`/documents/${document.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">File *</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.md,.js,.ts,.tsx,.jsx,.py"
              required
            />
            <p className="text-sm text-gray-500">
              Supported: PDF, DOCX, XLSX, TXT, MD, code files
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="design, research, product"
            />
          </div>
          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={loading || !file}>
            {loading ? 'Uploading...' : 'Upload to Braintrust'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
