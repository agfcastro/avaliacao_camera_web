'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "78ca75b1a762a32734e1d37c2dc96598",
"assets/AssetManifest.bin.json": "d8a4d1bdab6c5ede5684b39deb2582b5",
"assets/AssetManifest.json": "ec587cc352d36063749488e906c4e4cd",
"assets/assets/arucos/marker_bl.png": "1d09894096f48fa7c732c52337278057",
"assets/assets/arucos/marker_br.png": "361476fcfb2fb5e9a4718f1bb271265d",
"assets/assets/arucos/marker_tl.png": "4d6578b0e13899f8d8034d65d520046f",
"assets/assets/arucos/marker_tr.png": "cbf24977114a7cc19e55af04b6bc5edf",
"assets/assets/fonts/CorrectionScan-Regular.ttf": "38b25a091c42032b556246a329a4e189",
"assets/assets/images/construcao.png": "89926407c9ab3fdbd0cacd22a3b076ac",
"assets/assets/images/LogoGBlack.png": "de938e547c2564a54e19c1513ae0f682",
"assets/assets/images/LogoGColor.png": "7a77f791355a2c81e89f85ba14865bed",
"assets/assets/images/LogoGWhite.png": "8155827a49ee3326065678e5d232e8e4",
"assets/assets/images/LogoPBlack.png": "8dc0051aff9a9f1b36ac0124cb7f38e4",
"assets/assets/images/LogoPColor.png": "8c726e9c51055cd4ce335ef4f948e4ab",
"assets/assets/images/LogoPWhite.png": "47d02c4511d0b2e8acb54bb63d6992cc",
"assets/assets/js/es.js": "44500a6ebf2a11ed5465b08dbd89bfe5",
"assets/assets/js/es0.js": "27be57ac5571f1690d2eb62791a39c3c",
"assets/assets/smesystem_loading.gif": "69398c8a25ddee601e08fb5a0efd15cd",
"assets/FontManifest.json": "86d7f8c9595075dcf426163fa6ad9bf7",
"assets/fonts/MaterialIcons-Regular.otf": "5431e323a565f11bb4130c2bc58b065b",
"assets/NOTICES": "7c9a2fa3ed12e6f3a3268ea873773c7b",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "728b2d477d9b8c14593d4f9b82b484f3",
"canvaskit/canvaskit.js.symbols": "bdcd3835edf8586b6d6edfce8749fb77",
"canvaskit/canvaskit.wasm": "7a3f4ae7d65fc1de6a6e7ddd3224bc93",
"canvaskit/chromium/canvaskit.js": "8191e843020c832c9cf8852a4b909d4c",
"canvaskit/chromium/canvaskit.js.symbols": "b61b5f4673c9698029fa0a746a9ad581",
"canvaskit/chromium/canvaskit.wasm": "f504de372e31c8031018a9ec0a9ef5f0",
"canvaskit/skwasm.js": "ea559890a088fe28b4ddf70e17e60052",
"canvaskit/skwasm.js.symbols": "e72c79950c8a8483d826a7f0560573a1",
"canvaskit/skwasm.wasm": "39dd80367a4e71582d234948adc521c0",
"favicon-16x16.png": "619b338578e2aa6a39a77b3b75b6205f",
"favicon-32x32.png": "093651423348db1c0043cdf7677651b8",
"favicon.ico": "a280fc024b32326e5b8a8e6605cc8791",
"favicon.png": "619b338578e2aa6a39a77b3b75b6205f",
"flutter.js": "83d881c1dbb6d6bcd6b42e274605b69c",
"flutter_bootstrap.js": "4661d835b22d524d3266ff47cc197ce1",
"icons/android-chrome-192x192.png": "c917f6765ebffe412284263298bf8754",
"icons/android-chrome-512x512.png": "8004e29e637ea82d068adc749a43c150",
"icons/apple-touch-icon.png": "5c1e2be4d508b9de288cd2cb4a38ee5b",
"index.html": "37aca81dc4e8cd4b8fea9a5bc2f5f458",
"/": "37aca81dc4e8cd4b8fea9a5bc2f5f458",
"main.dart.js": "e0d672c94ea3411775ec09ce4bff2392",
"manifest.json": "14ae3902c7300f53f81a33c4ad1e3fd4",
"version.json": "802f9a0c4795488ba05fa43f602bf9be",
"_redirects": "51847f2976338374d01ff9e7daf292b3"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
