// service-worker.js - Versão Completa
const CACHE_NAME = 'lista-compras-v4-completa';
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/cadastro.html',
  '/css/style.css',
  '/css/login.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/supabaseClient.js',
  '/manifest.json',
  '/icons/favicon.ico',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap'
];

// Evento de Instalação - Cache de recursos
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache)
          .then(function() {
            console.log('Todos os recursos foram cacheados');
            return self.skipWaiting();
          })
          .catch(function(error) {
            console.error('Falha ao armazenar em cache:', error);
          });
      })
  );
});

// Evento de Ativação - Limpeza de caches antigos
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      console.log('Service Worker ativado e caches antigos removidos');
      return self.clients.claim();
    })
  );
});

// Evento de Fetch - Estratégia de Cache
self.addEventListener('fetch', function(event) {
  // Verifica se a requisição é para um dos domínios externos
  const isExternalRequest = 
    event.request.url.includes('supabase.co') || 
    event.request.url.includes('fonts.googleapis.com') ||
    event.request.url.includes('cdn.jsdelivr.net');

  if (isExternalRequest) {
    // Para requisições externas: tenta buscar online primeiro
    event.respondWith(
      fetch(event.request)
        .catch(function() {
          return caches.match(event.request);
        })
    );
  } else {
    // Para requisições locais: cache-first
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Retorna do cache se encontrado
          if (response) {
            console.log('Retornando do cache:', event.request.url);
            return response;
          }
          
          // Se não estiver no cache, busca na rede
          console.log('Buscando na rede:', event.request.url);
          return fetch(event.request)
            .then(function(fetchResponse) {
              // Faz uma cópia da resposta
              const responseToCache = fetchResponse.clone();
              
              // Armazena no cache para futuras requisições
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                  console.log('Novo recurso armazenado em cache:', event.request.url);
                });
              
              return fetchResponse;
            })
            .catch(function(error) {
              console.error('Falha na requisição:', error);
              // Pode retornar uma página de fallback aqui se desejar
              // return caches.match('/offline.html');
            });
        })
    );
  }
});

// Comunicação com a página principal
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    console.log('Pulando espera do Service Worker');
    self.skipWaiting();
  }
});

// Eventos adicionais para tratamento de erros
self.addEventListener('error', function(error) {
  console.error('Erro no Service Worker:', error);
});

self.addEventListener('unhandledrejection', function(event) {
  console.error('Promise rejeitada não tratada:', event.reason);
});
