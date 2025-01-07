# BvFetch

The BvFetch module provides methods to cache duplicate API calls and interact with the cacheStorage


## The following methods are provided:

## BvFetch Parameters
`shouldCache (Function):` A function that takes the API response JSON as input and returns a boolean indicating whether to cache the response or not. This allows you to implement custom logic based on the response content. If caching is desired, the function should return true; otherwise, false.
`cacheName (String):` Optional. Specifies the name of the cache to be used. If not provided, the default cache name 'bvCache' will be used.
`cacheLimit (Integer)`: Optional. Specifies the cache size limit for the cache storage. Its value should be in MB. Default value is 10 MB.

## bvFetchFunc Method Parameters
`url (String):` The URL of the API endpoint to fetch data from.
`options (Object):` Optional request options such as headers, method, etc., as supported by the Fetch API.

## bvFetchFunc Return Value
`Promise<Response>:` A promise that resolves to the API response. If the response is cached, it returns the cached response. Otherwise, it fetches data from the API endpoint, caches the response according to the caching logic, and returns the fetched response.

## generateCacheKey Method Parameters:
`url (String):` The URL of the API endpoint.
`options (Object):` Optional request options.
## generateCacheKey Return Value:
`Request:` The generated cache key.

## retrievecachedRequests Method
Retrieves cached Requests from the cache storage associated with the provided cache name.
## retrievecachedRequests Parameters
This method takes no parameters.
## retrievecachedRequests Return Value
`void:` This method does not return anything.

## fetchDataAndCache Method
Fetches data from the specified URL, caches the response, and returns the response.
## Parameters
`url (String):` The URL from which to fetch data.
`options (Object):` Optional request options such as headers, method, etc., as supported by the 
Fetch API.
`cacheKey (String):`
 The cache key associated with the fetched data.
## Return Value
`Promise<Response>:` A promise that resolves to the fetched response.

## fetchFromCache Method
Function to fetch data from cache.
## Parameters
`cacheKey (String):` The cache key to fetch data from the cache.
## Return Value
Promise<Response|null>: A Promise that resolves with a Response object if the data is found in cache, or null if the data is not cached or expired.

## cacheData Method
Caches the provided response with the specified cache key if it meets the criteria for caching.
## Parameters
`response (Response):` The response object to be cached.
`cacheKey (String):` The cache key associated with the response.
## Return Value
`void:` This method does not return anything.


## flushCache Method Parameters
This method takes no parameters.
## flushCache Return Value
`Promise<void>:` A promise indicating the completion of cache flush operation.

## manageCache Method
Manages the cache by deleting expired cache entries and maintaining the cache size limit.
## Parameters
This method takes no parameters.
## Return Value
`void:` This method does not return anything.


## Usage with of `BvFetch`:

```js
var BvFetch = require('bv-ui-core/lib/bvFetch')

// Initialize BV Fetch instance
const bvFetch = new BVFetch({
  canBeCached: canBeCached, // optional
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