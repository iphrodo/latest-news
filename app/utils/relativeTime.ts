export function formatRelativeTime(isoDate: string, now: number = Date.now()): string {
  const minutes = Math.max(0, Math.round((now - new Date(isoDate).getTime()) / 60000))
  if (minutes <= 2) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  if (minutes < 1440) return `${Math.round(minutes / 60)} h ago`
  return `${Math.round(minutes / 1440)} d ago`
}
