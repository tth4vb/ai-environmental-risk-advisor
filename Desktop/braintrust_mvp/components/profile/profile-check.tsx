'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProfileSetupDialog } from './profile-setup-dialog'

interface ProfileCheckProps {
  children: React.ReactNode
}

export function ProfileCheck({ children }: ProfileCheckProps) {
  const [profileExists, setProfileExists] = useState<boolean | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function checkProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!profile) {
          setShowDialog(true)
          setProfileExists(false)
        } else {
          setProfileExists(true)
        }
      }
    }

    checkProfile()
  }, [supabase])

  if (profileExists === null) {
    return <div className="container mx-auto py-8 text-center">Loading...</div>
  }

  return (
    <>
      <ProfileSetupDialog
        open={showDialog}
        onComplete={() => {
          setShowDialog(false)
          setProfileExists(true)
        }}
      />
      {profileExists && children}
    </>
  )
}
