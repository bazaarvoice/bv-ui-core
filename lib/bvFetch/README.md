# BvFetch

The BvFetch module provides methods to cache duplicate API calls and interact with the cacheStorage


## The following methods are provided:

`bvFetchFunc(url: string, options: object): Promise<Response>`
This function makes API calls and caches their responses. It accepts a URL string and optional request options object. Caches the api response and returns a Promise that resolves with the API response.

`generateCacheKey(url: string, options: object): string`
This function generates a unique cache key for the given URL and options object. It's used internally to manage cache entries.

`flushCache(): Promise<void>`
This function clears all cache entries stored in the cache storage.


## Usage with of `BvFetch`:

```js
var BvFetch = require('bv-ui-core/lib/bvFetch')

// Initialize BV Fetch instance
const bvFetch = new BVFetch({
  errorHandler: customErrorHandler, // optional
  cacheName: "bvCache" // optional, default is "bvCache"
});

// Make API calls using bvFetchFunc method
bvFetch.bvFetchFunc('https://api.example.com/data')
  .then(response => {
    // Handle response
  })
  .catch(error => {
    // Handle error
  });
  ```