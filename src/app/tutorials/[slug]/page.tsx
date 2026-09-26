import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Tutorial } from '@/lib/types'
import { SEED_TUTORIALS } from '@/lib/mockData'
import ViewTracker from '@/components/ViewTracker'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import ThemeToggle from '@/components/ThemeToggle'
import Logo from '@/components/Logo'
import ReadingProgressBar from '@/components/ReadingProgressBar'

interface Props {
  params: Promise<{ slug: string }>
}

async function getTutorial(slug: string): Promise<Tutorial | null> {
  const normSlug = (slug || '').toLowerCase().trim()

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .ilike('slug', normSlug)
        .eq('published', true)
        .maybeSingle()

      if (!error && data) {
        return data
      }
    } catch {
      // Fallback below
    }
  }

  return SEED_TUTORIALS.find((t) => t.slug.toLowerCase() === normSlug) || null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tutorial = await getTutorial(slug)
  if (!tutorial) return { title: 'Tutorial Not Found — Learn with Emrul' }
  const tags = Array.isArray(tutorial.tags) ? tutorial.tags : []
  return {
    title: `${tutorial.title || 'Tutorial'} — Learn with Emrul`,
    description: tutorial.excerpt || '',
    keywords: tags.join(', '),
  }
}

export default async function TutorialPage({ params }: Props) {
  const { slug } = await params
  const tutorial = await getTutorial(slug)
  if (!tutorial) notFound()

  const tags = Array.isArray(tutorial.tags) ? tutorial.tags : []

  const formatDate = (str: string) => {
    if (!str) return ''
    try {
      return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
      return str
    }
  }

  return (
    <div>
      <ReadingProgressBar />

      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-inner">
            <Link href="/" className="navbar-logo">
              <Logo size={32} />
              <span>Learn with <span className="logo-accent">Emrul</span></span>
            </Link>
            <div className="navbar-links">
              <Link href="/" className="nav-link">Tutorials</Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="tutorial-header">
        <div className="container-narrow">
          <Link href="/" className="back-link">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to tutorials
          </Link>

          <div className="tutorial-header-meta">
            <span className="card-category">{tutorial.category || 'Engineering'}</span>
            <span className="badge">{tutorial.difficulty || 'Intermediate'}</span>
          </div>

          <h1 className="tutorial-title">{tutorial.title}</h1>
          <div className="tutorial-excerpt-large">
            <MarkdownRenderer content={tutorial.excerpt || ''} />
          </div>

          <div className="tutorial-stats-bar">
            <div className="tutorial-stat">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tutorial.read_time || 5} min read
            </div>
            <div className="tutorial-stat">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(tutorial.created_at)}
            </div>
            <div className="tutorial-stat">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              by Emrul
            </div>

            {tags.length > 0 && (
              <div className="tags-list" style={{ marginLeft: 'auto' }}>
                {tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ paddingBottom: '80px' }}>
        <div className="container-narrow">
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '44px',
            }}
          >
            <MarkdownRenderer content={tutorial.content || ''} />
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <Link href="/" className="btn btn-secondary">
              ← Browse More Tutorials
            </Link>
          </div>
        </div>
      </main>

      <ViewTracker tutorialId={tutorial.id} />

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand"><Logo size={24} /> <span>Learn with <span className="logo-accent">Emrul</span></span></div>
            <p className="footer-copy">© {new Date().getFullYear()} Learn with Emrul</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
