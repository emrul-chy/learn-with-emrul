'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  tutorialId: string
  tutorialTitle: string
}

export default function DeleteTutorialButton({ tutorialId, tutorialTitle }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${tutorialTitle}"? This cannot be undone.`)) {
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('tutorials').delete().eq('id', tutorialId)

    if (error) {
      alert(`Error deleting tutorial: ${error.message}`)
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="btn btn-ghost btn-sm"
      style={{ color: '#f87171' }}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  )
}
