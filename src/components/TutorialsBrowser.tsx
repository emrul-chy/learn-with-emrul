'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Tutorial } from '@/lib/types'

interface Props {
  tutorials: Tutorial[]
  categories: string[]
}

export default function TutorialsBrowser({ tutorials, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut listener for quick search focus (/ or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.metaKey && e.key === 'k')) && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filtered = useMemo(() => {
    return tutorials.filter((t) => {
      const matchCat = activeCategory === 'All' || t.category === activeCategory
      const q = search.toLowerCase()
      const tags = Array.isArray(t.tags) ? t.tags : []
      const matchSearch =
        !q ||
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.excerpt && t.excerpt.toLowerCase().includes(q)) ||
        tags.some((tag) => tag.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [tutorials, activeCategory, search])

  const formatDate = (str: string) => {
    if (!str) return ''
    try {
      return new Date(str).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return str
    }
  }

  return (
    <>
      {/* Filter Bar */}
      <div className="filter-bar" id="categories">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            className={`filter-btn${activeCategory === cat ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
        <div className="search-wrapper">
          <svg className="search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={searchInputRef}
            className="search-input"
            type="text"
            placeholder="Search tutorials... (/)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No tutorials found</h3>
          <p>Try a different search term or browse another topic.</p>
        </div>
      ) : (
        <div className="tutorials-grid animate-fade-in">
          {filtered.map((tutorial) => {
            const tags = Array.isArray(tutorial.tags) ? tutorial.tags : []
            return (
              <Link key={tutorial.id} href={`/tutorials/${tutorial.slug}`} style={{ textDecoration: 'none' }}>
                <article className="tutorial-card">
                  <div className="card-header">
                    <div className="card-emoji">{tutorial.cover_emoji || '⚡'}</div>
                    <div className="card-badges">
                      <span className="badge">
                        {tutorial.difficulty || 'Intermediate'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="card-category">{tutorial.category}</div>
                    <h2 className="card-title" style={{ marginTop: '8px' }}>{tutorial.title}</h2>
                    <p className="card-excerpt" style={{ marginTop: '8px' }}>{tutorial.excerpt}</p>
                  </div>

                  {tags.length > 0 && (
                    <div className="tags-list">
                      {tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="card-footer">
                    <div className="card-meta">
                      <span className="meta-item">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {tutorial.read_time || 5} min read
                      </span>
                      <span className="meta-item">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(tutorial.created_at)}
                      </span>
                    </div>
                    <svg className="card-arrow" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
