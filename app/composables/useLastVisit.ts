import { ref } from 'vue'

const LAST_VISIT_KEY = 'news.lastVisit'
const FIRST_VISIT_FLOOR_MS = 90 * 60 * 1000

const boundary = ref<number>(Date.now() - FIRST_VISIT_FLOOR_MS)
let initialized = false

function stamp() {
  try {
    localStorage.setItem(LAST_VISIT_KEY, String(Date.now()))
  } catch {
    // storage unavailable; boundary just won't persist across visits
  }
}

function init() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  try {
    const raw = localStorage.getItem(LAST_VISIT_KEY)
    const stored = raw ? Number.parseInt(raw, 10) : NaN
    boundary.value = Number.isFinite(stored) && stored > 0 ? stored : Date.now() - FIRST_VISIT_FLOOR_MS
  } catch {
    boundary.value = Date.now() - FIRST_VISIT_FLOOR_MS
  }

  window.addEventListener('pagehide', stamp)
  window.addEventListener('beforeunload', stamp)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') stamp()
  })
}

export function useLastVisit() {
  init()
  return { boundary }
}
