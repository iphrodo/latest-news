import { ref } from 'vue'

export type Density = 'compact' | 'balanced' | 'large'

const DENSITY_KEY = 'news.density'
const VALID_DENSITIES: Density[] = ['compact', 'balanced', 'large']

const density = ref<Density>('balanced')
let initialized = false

function init() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  try {
    const stored = localStorage.getItem(DENSITY_KEY)
    if (stored && (VALID_DENSITIES as string[]).includes(stored)) {
      density.value = stored as Density
    }
  } catch {
    // keep default
  }
}

export function useDensity() {
  init()

  function setDensity(value: Density) {
    density.value = value
    try {
      localStorage.setItem(DENSITY_KEY, value)
    } catch {
      // storage unavailable; density stays in-memory for this session
    }
  }

  return { density, setDensity }
}
