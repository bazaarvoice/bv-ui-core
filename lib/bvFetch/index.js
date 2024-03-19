
/**
 * @fileOverview
 * Provides fetch utilties
 */

function createBvFetch (cb) {

  console.log('hre in create')
  // Helper function to generate a unique key for each API call
  function generateCacheKey (url) {
    const key = url
    return key
  }

  const isEmptyObj = obj =>
  !(obj && typeof obj === 'object' && Object.keys(obj).length > 0)
   
  const fetchPromises = new Map();

  function bvFetch (url) {

  // Map to store ongoing fetch promises
  // Main function to perform API calls
    const cacheKey = generateCacheKey(url);

    // Check if the same fetch is already in progress, if yes, return the promise
    if (fetchPromises.has(cacheKey)) {
      return fetchPromises.get(cacheKey);
    }

    var cachedResponse = {};
    const cacheName = 'bvFetchCache'
    // Check if the response is already cached
    caches.open(cacheName).then(cache => {
      cache.match(cacheKey).then(response => {
        if (response) {
          cachedResponse = response.clone();
          if (!isEmptyObj(cachedResponse)) {
            const cachedTime = cachedResponse.headers.get('X-Cached-Time')
            const ttl = cachedResponse.headers.get('Cache-Control').match(/max-age=(\d+)/)[1];
            const currentTimestamp = Date.now()
            const cacheAge = (currentTimestamp - cachedTime) / 1000;
            if (cacheAge < ttl) {
              return Promise.resolve(cachedResponse);
            } 
          else {
            // Cache has expired, remove it
              fetchPromises.delete(cacheKey);
            }
          }

        }
      })
    })

    // If not cached, make the API call and cache the response
    const promise = window.fetch(url).then(response => {

      const result = response.clone()
      result.json().then(res => {
        cb(res)
      }).catch(err => {
        return Promise.reject(err)
      })

      const newHeaders = new Headers(response.headers);
      newHeaders.append('X-Cached-Time', Date.now());
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });

      // Cache the response
      caches.open(cacheName).then(cache => {
        cache.put(cacheKey, newResponse).then(() => {
          console.log('Data cached')
        })
      })
      // Remove promise from ongoing fetch promises array once we get the response
      fetchPromises.delete(cacheKey);
      return Promise.resolve(newResponse);
    }).catch(error => {
      // Remove promise from ongoing fetch promises if there's an error
      fetchPromises.delete(cacheKey);
      return Promise.reject(error)
    });
    
    // Store the promise in ongoing fetch promises
    fetchPromises.set(cacheKey, promise);
    return promise
  }

  return bvFetch
}

module.exports = createBvFetch;


