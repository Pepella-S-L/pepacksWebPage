import { useEffect } from 'react'

export default function useDocumentTitle(title) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} · Indie Games Hub` : 'Indie Games Hub'
    return () => {
      document.title = prev
    }
  }, [title])
}
