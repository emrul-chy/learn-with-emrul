import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DeleteTutorialButton from '@/components/admin/DeleteTutorialButton'
import { NewTutorialIcon, EditIcon, DraftIcon } from '@/components/Icons'

export default async function TutorialsListPage() {
  const supabase = await createClient()
  const { data: tutorials } = await supabase
    .from('tutorials')
    .select('id, title, category, difficulty, published, read_time, created_at, slug')
    .order('created_at', { ascending: false })

  const formatDate = (str: string) =>
    new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="animate-fade-in">
      <div className="page-heading" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>All Tutorials</h1>
          <p>{tutorials?.length ?? 0} tutorials in total</p>
        </div>
        <Link href="/admin/tutorials/new" className="btn btn-primary" id="create-tutorial-link">
          <NewTutorialIcon size={16} /> Create New
        </Link>
      </div>

      <div className="form-card">
        {!tutorials || tutorials.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 24px' }}>
            <div className="empty-state-icon">
              <DraftIcon size={40} />
            </div>
            <h3>No tutorials yet</h3>
            <p>Create your first tutorial to start teaching.</p>
            <Link href="/admin/tutorials/new" className="btn btn-primary" style={{ marginTop: 16 }}>
              Create Tutorial
            </Link>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Read Time</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tutorials.map((t) => (
                <tr key={t.id}>
                  <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <Link
                      href={`/tutorials/${t.slug}`}
                      target="_blank"
                      style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                    >
                      {t.title}
                    </Link>
                  </td>
                  <td>
                    <span className="card-category" style={{ fontSize: '0.75rem' }}>{t.category}</span>
                  </td>
                  <td>
                    <span className="badge">
                      {t.difficulty}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{t.read_time} min</td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: t.published ? 'var(--accent-primary)' : 'var(--text-muted)',
                    }}>
                      {t.published ? '● Published' : '○ Draft'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatDate(t.created_at)}</td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/admin/tutorials/${t.id}/edit`} className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <EditIcon size={14} /> Edit
                      </Link>
                      <DeleteTutorialButton tutorialId={t.id} tutorialTitle={t.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
