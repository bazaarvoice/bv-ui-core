# BvFetch

The BvFetch module provides methods to cache duplicate API calls and interact with the cacheStorage


## The following methods are provided:

## BvFetch Parameters
`shouldCache (Function):` A function that takes the API response JSON as input and returns a boolean indicating whether to cache the response or not. This allows you to implement custom logic based on the response content. If caching is desired, the function should return true; otherwise, false.

`cacheName (String):` Optional. Specifies the name of the cache to be used. If not provided, the default cache name 'bvCache' will be used.

## bvFetchFunc Method Parameters
`url (String):` The URL of the API endpoint to fetch data from.

`options (Object):` Optional request options such as headers, method, etc., as supported by the Fetch API.

## bvFetchFunc Return Value
`Promise<Response>:` A promise that resolves to the API response. If the response is cached, it returns the cached response. Otherwise, it fetches data from the API endpoint, caches the response according to the caching logic, and returns the fetched response.

## generateCacheKey Method Parameters:
`url (String):` The URL of the API endpoint.
`options (Object):` Optional request options.

## generateCacheKey Return Value:
`string:` The generated cache key.

## updateCacheSize Method Parameters:
`sizeChange (number):` The change in cache size.

## updateCacheSize Return Value: 
This function does not return anything.

## retrieveCacheSize Method Parameters: 
This function does not accept any parameters.

## retrieveCacheSize Return Value:
Promise<number>: A promise that resolves to the retrieved cache size.

## flushCache Method Parameters
This method takes no parameters.

## flushCache Return Value
`Promise<void>:` A promise indicating the completion of cache flush operation.


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