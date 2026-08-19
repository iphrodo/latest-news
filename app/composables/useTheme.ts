import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'news.theme'

const theme = ref<Theme>('light')
let initialized = false

function resolveInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // fall through to system preference
  }
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

function applyTheme() {
  document.documentElement.dataset.theme = theme.value
}

function init() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  theme.value = resolveInitialTheme()
  applyTheme()
}

export function useTheme() {
  init()

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(THEME_KEY, theme.value)
    } catch {
      // storage unavailable; theme stays in-memory for this session
    }
    applyTheme()
  }

  return { theme, toggleTheme }
}
