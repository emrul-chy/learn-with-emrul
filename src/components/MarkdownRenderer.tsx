'use client'

import { useMemo } from 'react'
import { marked } from 'marked'
import katex from 'katex'

interface Props {
  content: string
}

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
})

function renderMarkdownAndMath(text: string): string {
  if (!text) return ''

  let processed = text

  // 1. Process Display Math: $$ ... $$
  processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    try {
      return `<div class="katex-display">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`
    } catch {
      return `$$${math}$$`
    }
  })

  // 2. Process Display Math: \[ ... \]
  processed = processed.replace(/\\\[([\s\S]+?)\\\]/g, (_, math) => {
    try {
      return `<div class="katex-display">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`
    } catch {
      return `\\[${math}\\]`
    }
  })

  // 3. Process Inline Math: $ ... $
  processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false })
    } catch {
      return `$${math}$`
    }
  })

  // 4. Process Inline Math: \( ... \)
  processed = processed.replace(/\\\(([\s\S]+?)\\\)/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false })
    } catch {
      return `\\(${math}\\)`
    }
  })

  // 5. Parse Markdown to HTML using marked
  try {
    const rawHtml = marked.parse(processed) as string
    return rawHtml
  } catch {
    return processed
  }
}

export default function MarkdownRenderer({ content }: Props) {
  const html = useMemo(() => renderMarkdownAndMath(content), [content])

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
