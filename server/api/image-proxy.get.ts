import { createError, defineEventHandler, getQuery, sendStream, setResponseHeader } from 'h3'

const ALLOWED_HOST = 'images.pushsquare.com'
const FETCH_TIMEOUT_MS = 3000

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const rawUrl = typeof query.url === 'string' ? query.url : undefined

  let target: URL
  try {
    if (!rawUrl) throw new Error('missing url')
    target = new URL(rawUrl)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid image URL' })
  }

  if (target.host !== ALLOWED_HOST) {
    throw createError({ statusCode: 403, statusMessage: 'Image host not allowed' })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(target.toString(), { signal: controller.signal })
  } catch (error) {
    throw createError({ statusCode: 502, statusMessage: 'Failed to fetch image', cause: error })
  } finally {
    clearTimeout(timeout)
  }

  const contentType = response.headers.get('content-type')
  if (!response.ok || !contentType?.startsWith('image/') || !response.body) {
    throw createError({ statusCode: 502, statusMessage: 'Failed to fetch image' })
  }

  setResponseHeader(event, 'Content-Type', contentType)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  return sendStream(event, response.body)
})
