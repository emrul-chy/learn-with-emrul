import TutorialForm from '@/components/admin/TutorialForm'

export default function NewTutorialPage() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="page-heading">
        <h1>Create New Tutorial</h1>
        <p>Publish a new software engineering tutorial to &quot;Learn with Emrul&quot;.</p>
      </div>

      <TutorialForm />
    </div>
  )
}
