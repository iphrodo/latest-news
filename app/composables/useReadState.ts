import { ref } from 'vue'

const READ_KEY = 'news.read'
const DIM_KEY = 'news.dimRead'

const readIds = ref<Set<string>>(new Set())
const dimRead = ref(true)
let initialized = false

function init() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  try {
    const raw = localStorage.getItem(READ_KEY)
    if (raw) readIds.value = new Set(JSON.parse(raw))
  } catch {
    readIds.value = new Set()
  }

  try {
    const rawDim = localStorage.getItem(DIM_KEY)
    if (rawDim !== null) dimRead.value = rawDim === 'true'
  } catch {
    // keep default
  }
}

function persistRead() {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...readIds.value]))
  } catch {
    // storage unavailable; read state stays in-memory for this session
  }
}

export function useReadState() {
  init()

  function isRead(id: string): boolean {
    return readIds.value.has(id)
  }

  function markRead(id: string) {
    if (readIds.value.has(id)) return
    readIds.value = new Set(readIds.value).add(id)
    persistRead()
  }

  function markAllRead(ids: string[]) {
    const next = new Set(readIds.value)
    ids.forEach((id) => next.add(id))
    readIds.value = next
    persistRead()
  }

  function setDimRead(value: boolean) {
    dimRead.value = value
    try {
      localStorage.setItem(DIM_KEY, String(value))
    } catch {
      // storage unavailable; setting stays in-memory for this session
    }
  }

  return { readIds, dimRead, isRead, markRead, markAllRead, setDimRead }
}
