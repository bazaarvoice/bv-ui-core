
/**
 * @fileOverview
 * Provides api response caching utilties
 */

const { fetch } = require('../polyfills/fetch')

module.exports = function BvFetch ({ shouldCache, cacheName }) {
  this.shouldCache = shouldCache;
  this.cacheName = cacheName || 'bvCache';
  this.fetchPromises = new Map();
  this.cacheSize = 0;

/**
 * Updates the cache size based on the provided size change.
 * @param {number} sizeChange - The change in cache size.
 */
  this.updateCacheSize = function (sizeChange) {
    // Update cache size
    const newCacheSize = this.cacheSize + sizeChange;
    this.cacheSize = newCacheSize > 0 ? newCacheSize : 0
    // Store the updated cache size in the cache
    caches.open(this.cacheName).then(cache => {
      cache.put('cacheSize', new Response(this.cacheSize.toString()));
    }).catch(err => {
      console.error('Error updating cache size:', err);
    });
  };

/**
 * Retrieves the cache size from the cache.
 * @returns {Promise<number>} A promise that resolves to the retrieved cache size.
 */
  this.retrieveCacheSize = function () {
    return caches.open(this.cacheName).then(cache => {
      return cache.match('cacheSize').then(response => {
        if (response) {
          return response.text().then(size => parseInt(size, 10));
        } 
        else {
          return 0; // Default value if cacheSize entry doesn't exist
        }
      });
    }).catch(err => {
      console.error('Error retrieving cache size:', err);
      return 0; // Default value in case of error
    });
  };


  /**
   * Generates a unique cache key for the given URL and options.
   * @param {string} url - The URL of the API endpoint.
   * @param {Object} options - Optional request options.
   * @returns {string} The generated cache key.
   */

  this.generateCacheKey =  (url, options) => {
    const optionsString = (Object.keys(options).length > 0) ? JSON.stringify(options) : '';
    const key = url + optionsString;
    return key;
  };

  /**
 * Cleans up expired cache entries.
 * This function iterates through all cached responses in the cache storage,
 * checks each response's age against its TTL (time-to-live), and deletes
 * any expired entries.
 */

  this.cleanupExpiredCache = function () {
    caches.open(cacheName).then((cache) => {
      cache.keys().then((keys) => {
        var currentTime = Date.now();

        keys.forEach((key) => {
          // Skip processing cacheSize entry
          if (key.url.includes('cacheSize')) {
            return;
          }
          cache.match(key).then((cachedResponse) => {
            if (cachedResponse) {
              const cacheResponseSize = parseInt(cachedResponse.headers.get('X-Bazaarvoice-Cached-Size'), 10);
              var cachedTime = parseInt(cachedResponse.headers.get('X-Bazaarvoice-Cached-Time'), 10);
              var ttl = parseInt(cachedResponse.headers.get('Cache-Control').match(/max-age=(\d+)/)[1], 10);
              var cacheAge = (currentTime - cachedTime) / 1000;
              if (cacheAge >= ttl) {
                this.updateCacheSize(-cacheResponseSize)
                cache.delete(key);
              }
            }
          });
        });
      });
    });
  };

  /**
   * Fetches data from the API endpoint, caches responses, and handles caching logic.
   * @param {string} url - The URL of the API endpoint.
   * @param {Object} options - Optional request options.
   * @returns {Promise<Response>} A promise resolving to the API response.
   */

  this.bvFetchFunc = (url, options = {}) => {
    // get the key
    const cacheKey = this.generateCacheKey(url, options);

    return this.retrieveCacheSize().then((cacheSize) => {
      this.cacheSize = cacheSize;

      // check if its available in the cache
      return caches.open(this.cacheName)
      .then(currentCache => currentCache.match(cacheKey))
      .then(cachedResponse => {
        if (cachedResponse) {
          const cachedTime = cachedResponse.headers.get('X-Bazaarvoice-Cached-Time');
          const ttl = cachedResponse.headers.get('Cache-Control').match(/max-age=(\d+)/)[1];
          const currentTimestamp = Date.now();
          const cacheAge = (currentTimestamp - cachedTime) / 1000;

          if (cacheAge < ttl) {
            // Cached response found
            this.cleanupExpiredCache()
            return cachedResponse.clone();
          }
        }

        // check if there is an ongoing promise
        if (this.fetchPromises.has(cacheKey)) {
          return this.fetchPromises.get(cacheKey).then(res => res.clone());
        }

        // Make a new call
        const newPromise = fetch(url, options);

        // Push the newPromise to the fetchPromises Map
        this.fetchPromises.set(cacheKey, newPromise);

        return newPromise
          .then(response => {
            const clonedResponse = response.clone();
            const checkResSize = response.clone();

            // Read the response body as text
            return checkResSize.text().then(text => {
              // Calculate the byte length of the response text
              const size = new Blob([text]).size;


              // Check if the cumulative response size exceeds 10MB
              if (this.cacheSize > 10 * 1024 * 1024) {
                //Delete promise from promise map if size exceeds limit
                this.fetchPromises.delete(cacheKey);
                return response;
              }

              // Check if the response should be cached based on custom logic
              let canBeCached = true;
              const errJson = clonedResponse.clone();
              return errJson.json().then(json => {
                if (typeof this.shouldCache === 'function') {
                  canBeCached = this.shouldCache(json);
                }
                return response
              }).then(res => { 
                if (canBeCached) {
                  const newHeaders = new Headers();
                  clonedResponse.headers.forEach((value, key) => {
                    newHeaders.append(key, value);
                  });
                  newHeaders.append('X-Bazaarvoice-Cached-Time', Date.now());
                  newHeaders.append('X-Bazaarvoice-Cached-Size', size);
                  const newResponse = new Response(clonedResponse._bodyBlob || clonedResponse.body, {
                    status: clonedResponse.status,
                    statusText: clonedResponse.statusText,
                    headers: newHeaders
                  });

                  // Clean up the old cached responses before caching new response
                  this.cleanupExpiredCache()

                  //Delete promise from promise map once its resolved
                  this.fetchPromises.delete(cacheKey);
                  
                  // Update cumulative response size
                  this.updateCacheSize(size)
                  
                  return caches.open(this.cacheName)
                    .then(currentCache =>
                      currentCache.put(cacheKey, newResponse)
                    )
                    .then(() => res);
                } 
                else {
                  //Delete promise from promise map if error exists
                  this.fetchPromises.delete(cacheKey);
                  return res;
                }
              })
            });
          });
      })

    })
      .catch(err => {
        // Remove the promise that was pushed earlier
        this.fetchPromises.delete(cacheKey);
        throw err;
      });
  };

  /**
   * Clears all cache entries stored in the cache storage.
   * @returns {Promise<void>} A promise indicating cache flush completion.
   */

  this.flushCache = () => {
    return caches.open(this.cacheName).then(cache => {
      return cache.keys().then(keys => {
        const deletionPromises = keys.map(key => cache.delete(key));
        return Promise.all(deletionPromises);
      });
    });
  };
  
}
