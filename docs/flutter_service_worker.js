'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "df58773bc5b8cb8861764572192dce7e",
"privacy_zh.html": "18e0ddf27afea54514910e8b5f103365",
"index.html": "2c28e55be2c0f34038b199c60944041f",
"/": "2c28e55be2c0f34038b199c60944041f",
"main.dart.js": "9248cd760dba925b4d4171646f8095d3",
"price.html": "1fc80297fc119dead13e3906950d1177",
"pay.html": "5a6bbb9543a77b55af1f07b4487d5a93",
"image/android.png": "b7a37fcc12a0687434f1981b113fe1dd",
"image/linux.png": "fc570b3cf0875adf9d91ad047a5923f7",
"image/ic_launcher.png": "35b1a846ffb648845e27a05156a063f3",
"image/ios.png": "76edd25dad148ab85e566b74a92239d3",
"image/ic_launcher_round.png": "239c3347bb0e94fc7f593a4bd23389f1",
"image/alipay.jpg": "e73f48f74322ccec272a72f5eaf5dd7d",
"image/windows.png": "bc1289429b02beff59f006d0315b86a1",
"image/wechat.jpg": "00d51c49a66eba7243e5705c647f79df",
"image/paypal.jpg": "0a67c895ca6e8e462b5331a32b404f46",
"image/bg.jpeg": "ebf324e1a6f4e21c0c4331d56744836f",
"image/darwin.png": "561a155eb7a09a94b09946d7cf6ba61b",
"favicon.png": "62c7a54e969d2bd4f12ffb7029419a48",
"icons/Icon-192.png": "b98cb536a18e030fd88e697d385fe795",
"icons/Icon-maskable-192.png": "b98cb536a18e030fd88e697d385fe795",
"icons/Icon-maskable-512.png": "092716dd2ccc4343d0e49f0ee9c78ba2",
"icons/Icon-512.png": "092716dd2ccc4343d0e49f0ee9c78ba2",
"manifest.json": "e4392d1f9fd46012fe0ea0b04680465a",
"api/update/android.txt": "c1087265602856b93bc71165bc9dc548",
"api/server/default.txt": "f8138eed4d20885d5573f5044ae26bf1",
"api/push/zh/android.json": "6f0cb4a184ee64ff40537c82e60e660f",
"api/push/en/android.json": "bbbb00ecafd96a2761a95410351faff2",
"privacy.txt": "9808fafe73d41b1097ed082d663b2c2b",
"assets/AssetManifest.json": "99914b932bd37a50b983c5e7c90ae93b",
"assets/NOTICES": "4229606d7dc392ee3526e1d664573b70",
"assets/FontManifest.json": "d751713988987e9331980363e24189ce",
"privacy.html": "440341cea2a5a4491c05dd22c949637b"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
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
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
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
