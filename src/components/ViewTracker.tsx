'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ViewTracker({ tutorialId }: { tutorialId: string }) {
  useEffect(() => {
    const supabase = createClient()
    supabase.from('tutorial_views').insert({ tutorial_id: tutorialId }).then(() => {})
  }, [tutorialId])

  return null
}
