'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Tutorial, CATEGORIES, DIFFICULTIES } from '@/lib/types'

interface Props {
  initialData?: Partial<Tutorial>
  isEditing?: boolean
}

export default function TutorialForm({ initialData, isEditing = false }: Props) {
  const router = useRouter()

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [isAutoSlug, setIsAutoSlug] = useState(!isEditing && !initialData?.slug)

  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [content, setContent] = useState(initialData?.content || '')
  
  // Custom & Dynamic Topics support
  const [availableCategories, setAvailableCategories] = useState<string[]>([...CATEGORIES])
  const [category, setCategory] = useState<string>(initialData?.category || CATEGORIES[0])
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [customCategoryInput, setCustomCategoryInput] = useState('')

  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    initialData?.difficulty || 'Beginner'
  )
  const [readTime, setReadTime] = useState(initialData?.read_time || 5)
  const [tagsStr, setTagsStr] = useState(initialData?.tags?.join(', ') || '')
  const [coverEmoji, setCoverEmoji] = useState(initialData?.cover_emoji || '⚡')
  const [published, setPublished] = useState(initialData?.published ?? true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch existing categories from DB to include custom ones
  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient()
      const { data } = await supabase.from('tutorials').select('category')
      if (data && data.length > 0) {
        const dbCats = [...new Set(data.map((d: { category: string }) => d.category))]
        const combined = [...new Set([...CATEGORIES, ...dbCats])]
        setAvailableCategories(combined)
        if (initialData?.category && !combined.includes(initialData.category)) {
          setAvailableCategories([...combined, initialData.category])
        }
      }
    }
    fetchCategories()
  }, [initialData?.category])

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (isAutoSlug) {
      setSlug(generateSlug(val))
    }
  }

  const handleSlugChange = (val: string) => {
    setSlug(val)
    setIsAutoSlug(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const finalCategory = isCustomCategory ? customCategoryInput.trim() : category
    if (!finalCategory) {
      setError('Please provide or select a Topic / Category.')
      setLoading(false)
      return
    }

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      title,
      slug: slug || generateSlug(title),
      excerpt,
      content,
      category: finalCategory,
      difficulty,
      read_time: Number(readTime),
      tags,
      cover_emoji: coverEmoji,
      published,
    }

    const supabase = createClient()

    if (isEditing && initialData?.id) {
      const { error: updateErr } = await supabase
        .from('tutorials')
        .update(payload)
        .eq('id', initialData.id)

      if (updateErr) {
        setError(updateErr.message)
        setLoading(false)
        return
      }
    } else {
      const { error: insertErr } = await supabase.from('tutorials').insert(payload)

      if (insertErr) {
        setError(insertErr.message)
        setLoading(false)
        return
      }
    }

    router.push('/admin/tutorials')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="form-card animate-fade-in">
      {error && (
        <div className="login-error" style={{ marginBottom: 24 }}>
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label required">Title</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Master System Design: Distributed Caching"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label required">URL Slug</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. master-system-design-caching"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            required
          />
          <div className="form-hint">
            Public URL: /tutorials/{slug || 'your-slug'}
            {isAutoSlug && <span style={{ marginLeft: 8, color: 'var(--accent-primary)' }}>(Auto-generating from Title)</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label required">Cover Emoji</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. ⚡"
            value={coverEmoji}
            onChange={(e) => setCoverEmoji(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-row-3">
        {/* Dynamic Topic / Category Selection & Custom Topic Creation */}
        <div className="form-group">
          <label className="form-label required">Topic / Category</label>
          {!isCustomCategory ? (
            <div>
              <select
                className="form-select"
                value={category}
                onChange={(e) => {
                  if (e.target.value === '__NEW__') {
                    setIsCustomCategory(true)
                  } else {
                    setCategory(e.target.value)
                  }
                }}
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__NEW__">+ Add New Custom Topic...</option>
              </select>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Type new topic name (e.g. Docker, AWS)"
                value={customCategoryInput}
                onChange={(e) => setCustomCategoryInput(e.target.value)}
                required={isCustomCategory}
                autoFocus
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsCustomCategory(false)}
                title="Select from existing topics"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label required">Difficulty</label>
          <select
            className="form-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label required">Estimated Read Time (mins)</label>
          <input
            type="number"
            min="1"
            max="120"
            className="form-input"
            value={readTime}
            onChange={(e) => setReadTime(Number(e.target.value))}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label required">Excerpt / Short Description</label>
        <textarea
          className="form-textarea"
          rows={3}
          placeholder="Brief summary of what readers will learn in this tutorial..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Tags (comma separated)</label>
        <input
          type="text"
          className="form-input"
          placeholder="system-design, redis, caching, backend"
          value={tagsStr}
          onChange={(e) => setTagsStr(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label required">Tutorial Content (Supports Markdown & LaTeX Math like $E = mc^2$ or $$\sum x_i$$)</label>
        <textarea
          className="form-textarea form-textarea-code"
          rows={16}
          placeholder="# Tutorial Heading&#10;&#10;Write your content in markdown with LaTeX math like $O(N \log N)$..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className="form-group" style={{ margin: '32px 0' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Publish Tutorial</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {published ? 'Visible to everyone on the main page' : 'Saved as private draft'}
            </div>
          </div>
        </label>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.push('/admin/tutorials')}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading
            ? 'Saving...'
            : isEditing
            ? 'Update Tutorial'
            : 'Publish Tutorial'}
        </button>
      </div>
    </form>
  )
}
