import { describe, expect, it, beforeEach, vi } from 'vitest'

describe('useReadState', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('marks an item read and persists it across a reload', async () => {
    const { useReadState } = await import('./useReadState')
    const { markRead, isRead } = useReadState()

    expect(isRead('a')).toBe(false)
    markRead('a')
    expect(isRead('a')).toBe(true)
    expect(JSON.parse(localStorage.getItem('news.read') ?? '[]')).toEqual(['a'])
  })

  it('marks every given id read via markAllRead', async () => {
    const { useReadState } = await import('./useReadState')
    const { markAllRead, isRead } = useReadState()

    markAllRead(['a', 'b', 'c'])
    expect(isRead('a')).toBe(true)
    expect(isRead('b')).toBe(true)
    expect(isRead('c')).toBe(true)
  })

  it('defaults dimRead to true and persists changes to it', async () => {
    const { useReadState } = await import('./useReadState')
    const { dimRead, setDimRead } = useReadState()

    expect(dimRead.value).toBe(true)
    setDimRead(false)
    expect(dimRead.value).toBe(false)
    expect(localStorage.getItem('news.dimRead')).toBe('false')
  })
})
