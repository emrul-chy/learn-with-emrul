import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Learn with Emrul — Software Engineering Tutorials',
  description: 'Minimal, high-signal software engineering tutorials on system design, frontend, backend, and infrastructure.',
  keywords: 'software engineering, tutorials, system design, react, typescript, programming',
  openGraph: {
    title: 'Learn with Emrul',
    description: 'Minimal, high-signal software engineering tutorials',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Ubuntu+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* KaTeX CSS for LaTeX math formatting */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
