import Link from 'next/link'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Tutorial } from '@/lib/types'
import { SEED_TUTORIALS } from '@/lib/mockData'
import TutorialsBrowser from '@/components/TutorialsBrowser'
import ThemeToggle from '@/components/ThemeToggle'
import Logo from '@/components/Logo'

export const revalidate = 60

async function getTutorials(): Promise<Tutorial[]> {
  if (!isSupabaseConfigured()) {
    return SEED_TUTORIALS
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tutorials')
      .select(`
        *,
        view_count:tutorial_views(count)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return SEED_TUTORIALS
    return data
  } catch {
    return SEED_TUTORIALS
  }
}

async function getCategories(tutorials: Tutorial[]): Promise<string[]> {
  const cats = [...new Set(tutorials.map((d) => d.category))]
  return cats
}

export default async function HomePage() {
  const tutorials = await getTutorials()
  const categories = await getCategories(tutorials)
  const totalViews = tutorials.reduce((sum, t) => {
    const vc = Array.isArray(t.view_count) ? t.view_count[0]?.count ?? t.view_count : t.view_count ?? 0
    return sum + Number(vc)
  }, 0)

  return (
    <div>
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
              <Link href="#categories" className="nav-link">Topics</Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Clean Centered Minimalist Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="container">
          <div className="hero-tag">
            <span className="pulse-dot" /> Software Engineering
          </div>
          <h1>
            Level Up Your<br />
            <span className="gradient-text">Engineering Skills</span>
          </h1>
          <p className="hero-subtitle">
            In-depth engineering tutorials on system design, frontend architecture, TypeScript, and backend systems.
            Crafted by Emrul.
          </p>
          <div className="hero-actions">
            <a href="#tutorials" className="btn btn-primary btn-lg">
              Explore Tutorials →
            </a>
            <a href="#categories" className="btn btn-secondary btn-lg">
              Browse Topics
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">{tutorials.length}+</div>
              <div className="stat-label">Tutorials</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{categories.length}+</div>
              <div className="stat-label">Topics</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews}</div>
              <div className="stat-label">Total Views</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorials Section */}
      <section id="tutorials" style={{ paddingBottom: '40px' }}>
        <div className="container">
          <TutorialsBrowser tutorials={tutorials} categories={categories} />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <Logo size={24} /> <span>Learn with <span className="logo-accent">Emrul</span></span>
            </div>
            <p className="footer-copy">
              © {new Date().getFullYear()} Learn with Emrul. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
