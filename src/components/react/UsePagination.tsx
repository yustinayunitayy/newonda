import { useEffect, useMemo, useState } from 'react'

export function usePaginate<T>(
  items: T[],
  pageSize: number,
  scrollRef?: { current: HTMLElement | null }
) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  useEffect(() => {
    setPage(1)
  }, [items])

  const safePage = Math.min(page, totalPages)

  const pageItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  )

  const goTo = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages))
    scrollRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return { page: safePage, totalPages, pageItems, goTo }
}
