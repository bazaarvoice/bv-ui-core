/* global fetch */
/**
 * @fileOverview Module for interacting with the statistcs.json endpoint.
 *
 */
const envPrefixMap = {
  qa: 'qa.api',
  staging: 'stg.api',
  production: 'api'
}

// Default configuration
const API_VERSION = 5.4
const MAX_REQUESTED_IDS = 100;

/**
 * Calls the statistics.json API with provided options. Returns a promise that
 * is fulfilled with an array of Results from the API or rejected with the error
 * message.
 *
 * Example:
 *
 * getStatistics({
 *  productIds: ['product1', 'product2', 'product3'],
 *  environment: 'qa',
 *  key: 'clients_api_key',
 *  type: 'Reviews',
 *  filters: {
 *   ContentLocale: 'en_US'
 *  }
 * }).then(results => {
 *   // Do something with results
 * }, errorMsg => {
 *   // Do something with error.
 * })
 *
 * https://developer.bazaarvoice.com/docs/read/conversations/statistics/display/5_4
 *
 * @param  {Object} options object that contains options
 * @param  {Array}  options.productIds - array of product IDs
 * @param  {Array}  options.environment - the data environment
 * @param  {Array}  options.key - client's api key
 * @param  {string}  options.type - Using "Reviews" returns statistics for all
 *         content, including syndicated content (if enabled on your API key).
 *         If you only want statistics for reviews you own that were written for
 *         the products specified, use "NativeReviews" instead.
 * @param  {Object}  [options.filters] - Filters object. Keyed by filter name.
 * @return {Promise} a promise that will be resolved with the raw results
 *                   from the statistics call.
 */
function getStatistics ({ productIds, environment, key, type, filters = {} }) {
  if (!productIds) {
    throw new TypeError('productIds must be an array')
  }
  if (!environment) {
    throw new TypeError(
      'environment must be \'qa\', \'staging\', or \'production\''
    )
  }
  if (!key) {
    throw new TypeError('key must be provided')
  }
  if (!type) {
    throw new TypeError('type must be \'Reviews\' or \'NativeReviews\'')
  }

  const envPrefix = envPrefixMap[environment]

  const uri = `https://${envPrefix}.bazaarvoice.com/data/statistics.json` +
            `?apiversion=${API_VERSION}` +
            `&passkey=${key}` +
            `&stats=${type}` +
            Object.keys(filters)
              .map(filter => `&filter=${filter}:${filters[filter]}`)
              .join()

  // Clone the productIds so we can manipulate it.
  productIds = productIds.slice()
  const productIdChunks = []

  if (productIds.length > 100) {
    console.log('Requesting more than 100 products is not recommended!')
  }

  while (productIds.length > 0) {
    productIdChunks.push(productIds.splice(0, MAX_REQUESTED_IDS))
  }

  return Promise.all(
    productIdChunks.map(products => new Promise((resolve, reject) => {
      const requestUri = `${uri}&filter=ProductId:${products.join(',')}`
      fetch(requestUri)
        .then(response => response.json())
        .then(json => {
          // If there are errors in the actual response body (from API)
          // we need to handle them here.
          if (json.HasErrors) {
            // TODO: Verify with the API team that Errors will always contain a
            // message. If there is more than one, we also need to do something.
            reject(json.Errors[0].Message)
          }
          else {
            resolve(json.Results)
          }
        })
    }))
  ).then(results => {
    if (results.length === 0) {
      return results
    }
    else {
      return results.reduce((a,b) => { return a.concat(b) })
    }
  })
}

module.exports = getStatistics
