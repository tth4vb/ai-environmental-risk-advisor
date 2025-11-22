'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProfileSetupDialogProps {
  open: boolean
  onComplete: () => void
}

export function ProfileSetupDialog({ open, onComplete }: ProfileSetupDialogProps) {
  const [displayName, setDisplayName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [team, setTeam] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          display_name: displayName,
          job_title: jobTitle || null,
          team: team || null,
        })

      if (insertError) throw insertError

      onComplete()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Tell us a bit about yourself to get started with Braintrust
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Name *</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Product Designer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Input
              id="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              placeholder="e.g. Design Team"
            />
          </div>
          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
