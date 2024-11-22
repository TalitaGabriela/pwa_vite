import { offlineFallback, warmStrategyCache } from "workbox-recipes";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { registerRoute } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

//configurando o cache
const pageCache = new CacheFirst({
  cacheName: 'vite-receitas-incriveis',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0,200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

//indicando o cache de página
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});
//registrando a rota
registerRoute(({request}) => request.mode === 'navigate', pageCache);

//configurando cache de assets
registerRoute(
  ({request}) => ['style','script','worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0,200]
      }),
    ],
  }),
);

//configuruando offline fallbaack
offlineFallback({
  pageFallback: '/offline.html',
});

//configurando cache de imagens
const imageRoute = new Route(({request}) => {
  return request.destination === 'image';
}, new CacheFirst({
  cacheName: 'images',
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: 60 * 60 * 24 * 30,
    })
  ]
}));

registerRoute(imageRoute);