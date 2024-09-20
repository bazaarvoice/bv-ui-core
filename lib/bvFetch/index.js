
/**
 * @fileOverview
 * Provides api response caching utilties
 */

const { fetch } = require('../polyfills/fetch')

module.exports = function BvFetch ({ shouldCache, cacheName, cacheLimit }) {
  this.shouldCache = shouldCache;
  this.cacheName = cacheName || 'bvCache';
  this.cacheLimit = cacheLimit * 1024 * 1024 || 10 * 1024 * 1024;
  this.fetchPromises = new Map();
  this.cachedUrls = new Set();

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
  * Retrieves cached URLs from the cache storage associated with the provided cache name.
  * @returns {void}
  */

  this.retrieveCachedUrls = () => {
    // Open the Cache Storage
    caches.open(this.cacheName).then(cache => {
    // Get all cache keys
      cache.keys().then(keys => {
        keys.forEach(request => {
          this.cachedUrls.add(request.url);
        });
      });
    });

  }

  //callretrieveCachedUrls function to set the cache URL set with the cached URLS
  this.retrieveCachedUrls();

  /**
    * Fetches data from the specified URL, caches the response, and returns the response.
    * @param {string} url - The URL from which to fetch data.
    * @param {string} cacheKey - The cache key associated with the fetched data.
    * @returns {Promise<Response>} A Promise that resolves with the fetched response.
    * @throws {Error} Throws an error if there's any problem fetching the data.
  */
  this.fetchDataAndCache = (url, options = {}, cacheKey) => {
    return fetch(url,options)
      .then((response) => {
        // initiate caching of response and return the response
        this.cacheData(response, cacheKey);
        return response.clone();
      })
      .catch(function (error) {
        throw new Error('Error fetching data: ' + error);
      });
  }

  /**
    * Caches the provided response with the specified cache key if it meets the criteria for caching.
    * @param {Response} response - The response object to be cached.
    * @param {string} cacheKey - The cache key associated with the response.
    * @returns {void}
  */

  this.cacheData = (response, cacheKey) => {
    const errJson = response.clone();
    let canBeCached = true;
    // Check for error in response obj
    errJson.json().then(json => {
      if (typeof this.shouldCache === 'function') {
        canBeCached = this.shouldCache(json);
      }
    }).then(() => {
      if (canBeCached) {
        const clonedResponse = response.clone();
        const sizeCheck = response.clone();
        const newHeaders = new Headers();
        clonedResponse.headers.forEach((value, key) => {
          newHeaders.append(key, value);
        });
        newHeaders.append('X-Bazaarvoice-Cached-Time', Date.now())
        // Get response text to calculate its size
        sizeCheck.text().then(text => {
        // Calculate size of response text in bytes
          const sizeInBytes = new Blob([text]).size;

        // Append response size to headers
          newHeaders.append('X-Bazaarvoice-Response-Size', sizeInBytes);

        // Create new Response object with modified headers
          const newResponse = new Response(clonedResponse._bodyBlob || clonedResponse.body, {
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
            headers: newHeaders
          });
          // Cache the response
          caches.open(this.cacheName).then(cache => {
            cache.put(cacheKey, newResponse);
            //add key to cachedUrls set
            this.cachedUrls.add(cacheKey);
          });
        });
      }
    })
  }

  /**
    * Function to fetch data from cache.
    * @param {string} cacheKey - The cache key to fetch data from the cache.
    * @returns {Promise<Response|null>} A Promise that resolves with a Response object if the data is found in cache, 
    * or null if the data is not cached or expired.
    * @throws {Error} Throws an error if there's any problem fetching from cache.
  */
  this.fetchFromCache = (cacheKey) => {
    // Check if the URL is in the set of cached URLs
    if (!this.cachedUrls.has(cacheKey)) {
      return Promise.resolve(null);
    }

    // Open the cache and try to match the URL
    return caches.open(this.cacheName)
      .then((cache) => {
        return cache.match(cacheKey)
          .then((cachedResponse) => {
                  
            const cachedTime = cachedResponse.headers.get('X-Bazaarvoice-Cached-Time');
            const ttl = cachedResponse.headers.get('Cache-Control').match(/max-age=(\d+)/)[1];
            const currentTimestamp = Date.now();
            const cacheAge = (currentTimestamp - cachedTime) / 1000;
            if (cacheAge < ttl) {
              // Cached response found
              return cachedResponse.clone();
            }
          })
      })
      .catch((error) => {
        throw new Error('Error fetching from cache: ' + error);
      });
  }

  /**
   * Fetches data from the API endpoint, caches responses, and handles caching logic.
   * @param {string} url - The URL of the API endpoint.
   * @param {Object} options - Optional request options.
   * @returns {Promise<Response>} A promise resolving to the API response.
   */

  this.bvFetchFunc = (url, options = {}) => {

    const cacheKey = this.generateCacheKey(url, options);
  // If an ongoing fetch promise exists for the URL, return it
    if (this.fetchPromises.has(cacheKey)) {
      return this.fetchPromises.get(cacheKey).then(res => res.clone());
    }

  // Check if response is available in cache
    const newPromise = this.fetchFromCache(cacheKey)
      .then((cachedResponse) => {
        if (!cachedResponse) {
          this.cachedUrls.delete(cacheKey)
          return Promise.resolve(null);
        }  
          // If response found in cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }
          // If response not found in cache, fetch from API and cache it
        return this.fetchDataAndCache(url, options, cacheKey);
      });

    // Store the ongoing fetch promise
    this.fetchPromises.set(cacheKey, newPromise);

    //initiate cache cleanUp
    this.debounceCleanupExpiredCache();

    // When fetch completes or fails, remove the promise from the store
    newPromise.finally(() => {
      this.fetchPromises.delete(cacheKey);
    });

    return newPromise.then(res => res.clone());
  }


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

  this.manageCache = () => {
    // Delete expired cache entries
    caches.open(this.cacheName).then(cache => {
      cache.keys().then(keys => {
        keys.forEach(key => {
          cache.match(key).then(response => {
            const cachedTime = response.headers.get('X-Bazaarvoice-Cached-Time');
            const ttl = response.headers.get('Cache-Control').match(/max-age=(\d+)/)[1];
            const currentTimestamp = Date.now();
            const cacheAge = (currentTimestamp - cachedTime) / 1000;
            if (cacheAge >= ttl) {
              cache.delete(key);
              this.cachedUrls.delete(key);
            }
          });
        });
      });
    });

    // Calculate total size of cached responses
    let totalSize = 0;
    caches.open(this.cacheName).then(cache => {
      cache.keys().then(keys => {
        // Create an array of promises for cache match operations
        const matchPromises = keys.map(key =>
                cache.match(key).then(response => {
                  const sizeHeader = response.headers.get('X-Bazaarvoice-Response-Size');
                  return parseInt(sizeHeader, 10);
                })
            );

        // wait for all match promises to resolve
        return Promise.all(matchPromises)
          .then(sizes => sizes.reduce((acc, size) => acc + size, 0));
      }).then(size => {
        totalSize = size;
        // If total size exceeds 10 MB, delete old cache entries
        if (totalSize > this.cacheLimit) {

          // create an array of cached responses
          const cacheEntries = [];
          return cache.keys().then(keys => {
            const cachesResEntries = keys.map(key =>
              cache.match(key).then(response => {
                const sizeHeader = response.headers.get('X-Bazaarvoice-Response-Size');
                const lastAccessedTime = response.headers.get('X-Bazaarvoice-Cached-Time');
                cacheEntries.push({ key, size: parseInt(sizeHeader, 10), lastAccessedTime });
              })
            );

            return Promise.all(cachesResEntries)
            .then(() => {
              // Sort cache entries by last accessed time in ascending order
              cacheEntries.sort((a, b) => a.lastAccessedTime - b.lastAccessedTime);
              
              // Delete older cache entries until total size is under 10 MB
              let currentSize = totalSize;
              cacheEntries.forEach(entry => {
                if (currentSize > this.cacheLimit) {
                  cache.delete(entry.key);
                  this.cachedUrls.delete(entry.key);
                  currentSize -= entry.size;
                }
              });
            });
          });
        }
      });
    });
  };


  function debounce (func, delay) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, arguments);
      }, delay);
    };
  }

  this.debounceCleanupExpiredCache = debounce(this.manageCache, 8000);
  
}