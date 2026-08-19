import { describe, expect, it, beforeEach, vi } from 'vitest'

describe('useDensity', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('defaults to balanced', async () => {
    const { useDensity } = await import('./useDensity')
    const { density } = useDensity()
    expect(density.value).toBe('balanced')
  })

  it('persists a chosen density and restores it on next load', async () => {
    const { useDensity } = await import('./useDensity')
    const { setDensity } = useDensity()
    setDensity('compact')
    expect(localStorage.getItem('news.density')).toBe('compact')

    vi.resetModules()
    const { useDensity: useDensityAgain } = await import('./useDensity')
    expect(useDensityAgain().density.value).toBe('compact')
  })

  it('ignores an invalid stored value and falls back to the default', async () => {
    localStorage.setItem('news.density', 'huge')
    const { useDensity } = await import('./useDensity')
    expect(useDensity().density.value).toBe('balanced')
  })
})
