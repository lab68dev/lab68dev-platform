const CACHE_NAME = 'lab68dev-v1'

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

// Fetch: network-first with offline fallback
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET and API/auth requests
  if (request.method !== 'GET') return
  if (request.url.includes('/api/')) return
  if (request.url.includes('/auth/')) return
  if (request.url.includes('supabase')) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful navigation responses
        if (response.ok && request.mode === 'navigate') {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(async () => {
        // Try cache first
        const cachedResponse = await caches.match(request)
        if (cachedResponse) return cachedResponse

        // For navigation requests, show offline page
        if (request.mode === 'navigate') {
          const offlinePage = await caches.match('/offline')
          if (offlinePage) return offlinePage
        }

        return new Response('Offline', { status: 503 })
      })
  )
})
