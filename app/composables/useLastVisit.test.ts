import { describe, expect, it, beforeEach, vi } from 'vitest'

const FLOOR_MS = 90 * 60 * 1000

describe('useLastVisit', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('floors the boundary at 90 minutes before now on first visit', async () => {
    const before = Date.now()
    const { useLastVisit } = await import('./useLastVisit')
    const { boundary } = useLastVisit()
    const after = Date.now()

    expect(boundary.value).toBeGreaterThanOrEqual(before - FLOOR_MS)
    expect(boundary.value).toBeLessThanOrEqual(after - FLOOR_MS)
  })

  it('uses the stored last-visit timestamp when one exists', async () => {
    const stored = Date.now() - 5 * 60_000
    localStorage.setItem('news.lastVisit', String(stored))

    const { useLastVisit } = await import('./useLastVisit')
    expect(useLastVisit().boundary.value).toBe(stored)
  })

  it('writes a new last-visit timestamp on pagehide', async () => {
    const { useLastVisit } = await import('./useLastVisit')
    useLastVisit()

    const before = Date.now()
    window.dispatchEvent(new Event('pagehide'))
    const stored = Number.parseInt(localStorage.getItem('news.lastVisit') ?? '0', 10)

    expect(stored).toBeGreaterThanOrEqual(before)
  })

  it('does not shift the boundary mid-session even after a pagehide stamp', async () => {
    const stored = Date.now() - 5 * 60_000
    localStorage.setItem('news.lastVisit', String(stored))

    const { useLastVisit } = await import('./useLastVisit')
    const { boundary } = useLastVisit()

    window.dispatchEvent(new Event('pagehide'))

    expect(boundary.value).toBe(stored)
  })
})
