
/**
 * @fileOverview
 * Provides api response caching utilties
 */

const { fetch } = require('../polyfills/fetch')

module.exports = function BvFetch ({ shouldCache, cacheName }) {
  this.shouldCache = shouldCache;
  this.cacheName = cacheName || 'bvCache';
  this.fetchPromises = new Map();

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
   * Fetches data from the API endpoint, caches responses, and handles caching logic.
   * @param {string} url - The URL of the API endpoint.
   * @param {Object} options - Optional request options.
   * @returns {Promise<Response>} A promise resolving to the API response.
   */

  this.bvFetchFunc = (url, options = {}) => {
    // get the key
    const cacheKey = this.generateCacheKey(url, options);

    // check if its available in the cache
    return caches.open(this.cacheName)
      .then(currentCache => currentCache.match(cacheKey))
      .then(cachedResponse => {
        if (cachedResponse) {
          const cachedTime = cachedResponse.headers.get('X-Cached-Time');
          const ttl = cachedResponse.headers.get('Cache-Control').match(/max-age=(\d+)/)[1];
          const currentTimestamp = Date.now();
          const cacheAge = (currentTimestamp - cachedTime) / 1000;

          if (cacheAge < ttl) {
            // Cached response found
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
            const errJson = clonedResponse.clone()
            let canBeCached = true;
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
                newHeaders.append('X-Cached-Time', Date.now());

                const newResponse = new Response(clonedResponse._bodyBlob, {
                  status: clonedResponse.status,
                  statusText: clonedResponse.statusText,
                  headers: newHeaders
                });
                //Delete promise from promise map once its resolved
                this.fetchPromises.delete(cacheKey);

                return caches.open(this.cacheName)
                .then(currentCache =>
                  currentCache.put(cacheKey, newResponse)
                )
                .then(() => res);
              } 
              else {
                //Delete promise from promise map if error exists
                this.fetchPromises.delete(cacheKey);

                return res
              }

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
