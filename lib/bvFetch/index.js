
/**
 * @fileOverview
 * Provides api response caching utilties
 */


function createBvFetch (cb) {
  // Helper function to generate a unique key for each API call
  function generateCacheKey (url) {
    const key = url
    return key
  }
   
  const fetchPromises = new Map();

  function bvFetch (url) {
    const cacheKey = generateCacheKey(url+'');
    // Check if the same fetch is already in progress, if yes, return the promise
    if (fetchPromises.has(cacheKey)) {
      return fetchPromises.get(cacheKey);
    }

    const cacheName = 'bvFetchCache';

    // Check if the response is already cached
    const cachePromise = caches.open(cacheName).then(cache => {
      return cache.match(cacheKey).then(response => {
        if (response) {
          const cachedTime = response.headers.get('X-Cached-Time');
          const ttl = response.headers.get('Cache-Control').match(/max-age=(\d+)/)[1];
          const currentTimestamp = Date.now();
          const cacheAge = (currentTimestamp - cachedTime) / 1000;

          if (cacheAge < ttl) {
            //Cached response found
            return response.clone();
          } 
          else {
            //Cached response expired, removing from cache
            fetchPromises.delete(cacheKey);
            return null;
          }
        } 
        else {
          return null;
        }
      });
    });

    // Perform the fetch operation
    const fetchPromise = cachePromise.then(cachedResponse => {
      if (cachedResponse !== null) {
        return Promise.resolve(cachedResponse);
      } 
      else {
       //Fetching data from server
        return window.fetch(url).then(response => {
          const result = response.clone();
          result.json().then(res => {
            try {
              cb(res, url.pathname);
            } 
            catch (err) {
              return Promise.reject(err);
            }
          }).catch(err => {
            return Promise.reject(err);
          });

          const newHeaders = new Headers(response.headers);
          newHeaders.append('X-Cached-Time', Date.now());
          const newResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });

          // Cache the response
          const finalRes = newResponse.clone()
          caches.open(cacheName).then(cache => {
            cache.put(cacheKey, finalRes).then(() => {
              console.log('Data cached');
            });
          });

          return Promise.resolve(newResponse);
        }).catch(error => {
          return Promise.reject(error);
        });
      }
    });

    // Store the promise in ongoing fetch promises
    fetchPromises.set(cacheKey, fetchPromise);

    return fetchPromise;
  }


  return bvFetch
}

module.exports = createBvFetch;


