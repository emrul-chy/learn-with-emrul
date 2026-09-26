import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TutorialsIcon, PublishedIcon, DraftIcon, ViewsIcon, NewTutorialIcon, EditIcon } from '@/components/Icons'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalTutorials },
    { count: publishedCount },
    { count: draftCount },
    { count: totalViews },
    { data: recentTutorials },
  ] = await Promise.all([
    supabase.from('tutorials').select('*', { count: 'exact', head: true }),
    supabase.from('tutorials').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('tutorials').select('*', { count: 'exact', head: true }).eq('published', false),
    supabase.from('tutorial_views').select('*', { count: 'exact', head: true }),
    supabase.from('tutorials').select('id, title, category, difficulty, published, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { icon: <TutorialsIcon size={20} />, label: 'Total Tutorials', value: totalTutorials ?? 0 },
    { icon: <PublishedIcon size={20} />, label: 'Published', value: publishedCount ?? 0 },
    { icon: <DraftIcon size={20} />, label: 'Drafts', value: draftCount ?? 0 },
    { icon: <ViewsIcon size={20} />, label: 'Total Views', value: totalViews ?? 0 },
  ]

  const formatDate = (str: string) =>
    new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="animate-fade-in">
      <div className="page-heading">
        <h1>Dashboard</h1>
        <p>Overview of your software engineering tutorial portal.</p>
      </div>

      {/* Vector Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-card-icon">
              {stat.icon}
            </div>
            <div className="stat-card-value">{stat.value.toLocaleString()}</div>
            <div className="stat-card-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
        <Link href="/admin/tutorials/new" className="btn btn-primary" id="new-tutorial-btn">
          <NewTutorialIcon size={16} /> New Tutorial
        </Link>
        <Link href="/admin/tutorials" className="btn btn-secondary">
          <TutorialsIcon size={16} /> Manage Tutorials
        </Link>
      </div>

      {/* Recent Tutorials Table */}
      <div className="form-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Tutorials</h2>
          <Link href="/admin/tutorials" className="btn btn-ghost btn-sm">View all →</Link>
        </div>

        {!recentTutorials || recentTutorials.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 24px' }}>
            <div className="empty-state-icon">
              <DraftIcon size={40} />
            </div>
            <h3>No tutorials yet</h3>
            <p>Create your first tutorial to get started.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentTutorials.map((t) => (
                <tr key={t.id}>
                  <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</td>
                  <td>
                    <span className="card-category" style={{ fontSize: '0.75rem' }}>{t.category}</span>
                  </td>
                  <td>
                    <span className="badge">
                      {t.difficulty}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: t.published ? 'var(--accent-primary)' : 'var(--text-muted)',
                    }}>
                      {t.published ? '● Published' : '○ Draft'}
                    </span>
                  </td>
                  <td>{formatDate(t.created_at)}</td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/admin/tutorials/${t.id}/edit`} className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <EditIcon size={14} /> Edit
                      </Link>
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
