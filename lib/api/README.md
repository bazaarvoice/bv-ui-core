## API

This module acts as a javascript wrapper around api.bazaarvoice.com. For more
information about the API, please see the [API documentation][0].

### Requirements

This module is written using ES6. In order to use the source you may need to
provide your own transpiler, depending on your supported browsers.

We also takes advantage of some built-ins that you may need to polyfill:

- `fetch`: http://caniuse.com/#feat=fetch
- `Promise`: http://caniuse.com/#feat=promises

#### How to Use

Before using, you'll need to load up the API module:

```javascript
const api = require('bv-ui-core/lib/api')
```

Or if you know the specific type of request you are going to make you can
call, you can do the following:

```javascript
const getStatistics = require('bv-ui-core/lib/api/statistics')
```

## METHODS

Supported methods:
* [statistics/getStatistics](#getstatistics)

---

### getStatistics

Returns the statistics for a given list of products.

#### Syntax

```javascript
api.get('statistics', options)

// or
const getStatistics = require('bv-ui-core/lib/api/statistics')
getStatistics(options)
```

#### Parameters

##### options

An object with key/value pairs of inputs. Most values are required.

##### options.productIds

An array of product ids to query for.

##### options.environment

A string representing the data environment. Accepts `qa`, `staging` or
`production`.

##### options.key

Your api key.

##### options.type

A string representing the type of statistics you want to query for. Currently
accepts `Reviews` or `NativeReviews`.

Using `Reviews` returns statistics for all content, including syndicated
content (if enabled on your API key). If you only want statistics for reviews 
you own that were written for the products specified, use `NativeReviews` 
instead.

##### options.filters (optional)

An object representing filters keyed by the name of the filter. `ContentLocale `
can be provided to specify a locale subset for the statistics. If no
`ContentLocale` is provided, will return the global statistics for each product
in the query.

Example:

```javascript
getStatistics({
  ...
  filters: {
    ContentLocale: 'en_US'
  }
})

// Results in a call to
// api.bazaarvoice.com?...&filter=ContentLocale:en_US
```


#### Description

The getStatistics call will return an array of Results or the error message
(if any) from the API.

#### Examples

```javascript
//Get all syndicated review statistics for product1, product2
//and product3 from the en_US locale.
getStatistics({
  productIds: ['product1', 'product2', 'product3'],
  environment: 'qa',
  key: 'clients_api_key',
  type: 'Reviews',
  filters: {
    ContentLocale: 'en_US'
  }
}).then(results => {
  // Do something with results array.
}, errorMessage => {
  // Do something with the error message
})
```

---

[0]: https://developer.bazaarvoice.com/docs/read/conversations
