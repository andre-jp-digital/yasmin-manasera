type Dir = 'right' | 'down' | 'up' | 'down-right' | 'up-right'
const rot: Record<Dir, number> = { right: 0, down: 90, up: -90, 'down-right': 45, 'up-right': -45 }

export function Arrow({ dir = 'right', size = 18, stroke = 1.6 }: { dir?: Dir; size?: number; stroke?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ transform: `rotate(${rot[dir]}deg)` }}
    >
      <path d="M3 12h17M13.5 5.5 20 12l-6.5 6.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap="square" />
    </svg>
  )
}
