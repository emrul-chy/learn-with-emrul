import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TutorialForm from '@/components/admin/TutorialForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditTutorialPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: tutorial, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !tutorial) {
    notFound()
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="page-heading">
        <h1>Edit Tutorial</h1>
        <p>Update tutorial details, content, or publication status.</p>
      </div>

      <TutorialForm initialData={tutorial} isEditing={true} />
    </div>
  )
}
