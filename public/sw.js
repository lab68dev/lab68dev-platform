const CACHE_NAME = 'lab68studio-v3'

const STATIC_ASSETS = [
  '/offline',
  '/images/design-mode/favicon.ico',
]

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch: never cache app HTML or Next.js chunks. Stale navigations can hydrate
// against a newer client bundle after deploys or dev-server restarts.
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and API/auth requests
  if (request.method !== 'GET') return
  if (url.pathname.startsWith('/_next/')) return
  if (url.pathname.startsWith('/api/')) return
  if (url.pathname.startsWith('/auth/')) return
  if (url.hostname.includes('supabase')) return

  if (request.mode !== 'navigate') return

  event.respondWith(
    fetch(request)
      .catch(async () => {
        const offlinePage = await caches.match('/offline')
        if (offlinePage) return offlinePage

        return new Response('Offline', { status: 503 })
      })
  )
})
