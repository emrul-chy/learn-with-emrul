import React from 'react'

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <div
      className="logo-icon"
      style={{
        width: size,
        height: size,
        borderRadius: size > 40 ? 12 : 8,
        background: 'var(--accent-primary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg
        width={Math.round(size * 0.58)}
        height={Math.round(size * 0.58)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    </div>
  )
}
