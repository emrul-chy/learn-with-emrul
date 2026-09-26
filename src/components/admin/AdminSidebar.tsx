'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'
import { DashboardIcon, TutorialsIcon, NewTutorialIcon, PublicSiteIcon, SignOutIcon } from '@/components/Icons'

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/signin')
    router.refresh()
  }

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <DashboardIcon size={16} /> },
    { href: '/admin/tutorials', label: 'All Tutorials', icon: <TutorialsIcon size={16} /> },
    { href: '/admin/tutorials/new', label: 'New Tutorial', icon: <NewTutorialIcon size={16} /> },
  ]

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <Logo size={28} />
        <div>
          <div className="sidebar-brand-name">Learn with Emrul</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Admin Panel</div>
        </div>
      </div>

      <div className="sidebar-label">Navigation</div>

      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`sidebar-link${pathname === link.href ? ' active' : ''}`}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}

      <div className="sidebar-label" style={{ marginTop: 'auto' }}>Settings</div>

      <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Theme</span>
        <ThemeToggle />
      </div>

      <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Signed in as</div>
        <div style={{ fontSize: '0.775rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {userEmail}
        </div>
      </div>

      <Link
        href="/"
        className="sidebar-link"
        target="_blank"
        style={{ marginTop: '8px' }}
      >
        <PublicSiteIcon size={16} />
        View Public Site
      </Link>

      <button
        onClick={handleSignOut}
        className="sidebar-link btn-ghost"
        id="signout-btn"
        style={{
          width: '100%',
          textAlign: 'left',
          color: '#f87171',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          marginTop: '4px',
        }}
      >
        <SignOutIcon size={16} />
        Sign Out
      </button>
    </aside>
  )
}
