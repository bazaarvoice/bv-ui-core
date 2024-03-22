
// /**
//  * @fileOverview
//  * Provides api response caching utilties
//  */

const { fetch } = require('../polyfills/fetch')

module.exports = function BvFetch ({ errorHandler, cacheName }) {
  this.errorHandler = errorHandler;
  this.cacheName = cacheName || 'bvCache';
  this.fetchPromises = new Map();


  this.generateCacheKey =  (url, options) => {
    const optionsString = (Object.keys(options).length > 0) ? JSON.stringify(options) : '';
    const key = url + optionsString;
    return key;
  };

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

          // Cached response expired, removing from cache
          this.fetchPromises.delete(cacheKey);
        }

        // check if there is an ongoing promise
        if (this.fetchPromises.has(cacheKey)) {
          return this.fetchPromises.get(cacheKey);
        }

        // Make a new call
        const newPromise = fetch(url, options);

        // Push the newPromise to the fetchPromises Map
        this.fetchPromises.set(cacheKey, newPromise);

        return newPromise
          .then(response => {
            const clonedResponse = response.clone();
            const errJson = clonedResponse.clone()
            return errJson.json().then(json => {
              if (typeof this.errorHandler === 'function') {
                this.errorHandler(json, url.pathname);
              }
              return response;
            }).then(response => {
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
                .then(() => response);
            });
          })
      })
      .catch(err => {
        // Remove the promise that was pushed earlier
        this.fetchPromises.delete(cacheKey);
        throw err;
      });
  };

  this.flushCache = () => {
    return caches.open(this.cacheName).then(cache => {
      return cache.keys().then(keys => {
        const deletionPromises = keys.map(key => cache.delete(key));
        return Promise.all(deletionPromises);
      });
    });
  };
  
}
