// Service Worker tối giản — cache kiểu "stale-while-revalidate" cho tài nguyên cùng gốc
// (HTML/JS/CSS/ảnh của chính app). KHÔNG cache các lượt gọi tới Supabase (khác gốc),
// để dữ liệu bài học/điểm số luôn lấy mới nhất, không bị "đứng" dữ liệu cũ.
const CACHE_NAME = 'hocnhac-cache-v2'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return // bỏ qua Supabase và mọi domain khác

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request)
      const network = fetch(request)
        .then((response) => { if (response.ok) cache.put(request, response.clone()); return response })
        .catch(() => cached)
      return cached || network
    })
  )
})
