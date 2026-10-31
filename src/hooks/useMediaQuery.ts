import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string, serverFallback = false) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  )
}

/** Dispositivo com ponteiro fino e hover real (mouse/trackpad). */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
