import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    vi.resetModules()
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('defaults to light when there is no stored preference and the system prefers light', async () => {
    const { useTheme } = await import('./useTheme')
    const { theme } = useTheme()
    expect(theme.value).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('defaults to dark when the system prefers dark and nothing is stored', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: true,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
    const { useTheme } = await import('./useTheme')
    expect(useTheme().theme.value).toBe('dark')
  })

  it('toggling persists the choice and survives a reload', async () => {
    const { useTheme } = await import('./useTheme')
    const { theme, toggleTheme } = useTheme()

    toggleTheme()
    expect(theme.value).toBe('dark')
    expect(localStorage.getItem('news.theme')).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')

    vi.resetModules()
    const { useTheme: useThemeAgain } = await import('./useTheme')
    expect(useThemeAgain().theme.value).toBe('dark')
  })
})
