/**
 * @fileOverview Tests for API.
 *
 * These tests will fail unless run in a browser due to whatwg-fetch polyfill.
 *
 * @module test/apicacherequest
 */
let _ = require('lodash')

const API_RESULT_SUCCESS = require('json!./response.json')

const mockFetchSuccess = () => {
  return {
    then: () => {
      return {
        then: (callback) => {
          let apiResult = API_RESULT_SUCCESS
          callback(apiResult)
        }
      }
    }
  }
}

const mockFetchFail = () => {
  return {
    then: () => {
      return {
        then: (callback) => {
          let apiResult = {
            HasErrors: true,
            Errors: [{
              Message: 'An error occurred.'
            }]
          }
          callback(apiResult)
        }
      }
    }
  }
}

const mockFetchFailMissingError = () => {
  return {
    then: () => {
      return {
        then: (callback) => {
          let apiResult = {
            HasErrors: true
          }
          callback(apiResult)
        }
      }
    }
  }
}

let getStatistics = require('../../../lib/api/statistics')

describe('getStatistics', () => {
  const oldFetch = window.fetch

  after(() => {
    window.fetch = oldFetch
  })

  beforeEach(() => {
    window.fetch = mockFetchSuccess
  })

  describe('parameter validation', () => {
    it('should throw if not provided productIds', () => {
      expect(() => getStatistics({
        environment: 'qa',
        key: 'clients_api_key',
        type: 'Reviews',
        filters: {
          ContentLocale: 'en_US'
        }
      })).to.throw('productIds must be an array')
    })

    it('should throw if provided non-array productIds', () => {
      let invalids = ['product1', { id: 'product1' }]
      for (let productId in invalids) {
        expect(() => getStatistics({
          productIds: productId,
          environment: 'qa',
          key: 'clients_api_key',
          type: 'Reviews',
          filters: {
            ContentLocale: 'en_US'
          }
        })).to.throw('productIds must be an array')
      }
    })

    it('should throw if not provided environment', () => {
      expect(() => getStatistics({
        productIds: ['product1', 'product2', 'product3'],
        key: 'clients_api_key',
        type: 'Reviews',
        filters: {
          ContentLocale: 'en_US'
        }
      })).to.throw('environment must be "qa", "staging", or "production"')
    })

    it('should throw if provided invalid environment', () => {
      let invalids = ['dev', 'stg', 'prod']

      for (let environment in invalids) {
        expect(() => getStatistics({
          productIds: ['product1', 'product2', 'product3'],
          environment: environment,
          key: 'clients_api_key',
          type: 'Reviews',
          filters: {
            ContentLocale: 'en_US'
          }
        })).to.throw('environment must be "qa", "staging", or "production"')
      }
    })

    it('should throw if not provided key', () => {
      expect(() => getStatistics({
        productIds: ['product1', 'product2', 'product3'],
        environment: 'qa',
        type: 'Reviews',
        filters: {
          ContentLocale: 'en_US'
        }
      })).to.throw('key must be provided')
    })

    it('should throw if not provided type', () => {
      expect(() => getStatistics({
        productIds: ['product1', 'product2', 'product3'],
        environment: 'qa',
        key: 'clients_api_key',
        filters: {
          ContentLocale: 'en_US'
        }
      })).to.throw('type must be "Reviews" or "NativeReviews"')
    })

    it('should throw if provided invalid type', () => {
      expect(() => getStatistics({
        productIds: ['product1', 'product2', 'product3'],
        environment: 'qa',
        key: 'clients_api_key',
        filters: {
          ContentLocale: 'en_US'
        },
        type: 'reviews'
      })).to.throw('type must be "Reviews" or "NativeReviews"')
    })
  })

  it('should work in general', () => {
    return getStatistics({
      productIds: ['product1', 'product2', 'product3'],
      environment: 'qa',
      key: 'clients_api_key',
      type: 'Reviews',
      filters: {
        ContentLocale: 'en_US'
      }
    })
  })

  it('should work for requests over 100', () => {
    const products = _.range(1, 300).map(id => `product${id}`)

    return getStatistics({
      productIds: products,
      environment: 'qa',
      key: 'clients_api_key',
      type: 'Reviews',
      filters: {
        ContentLocale: 'en_US'
      }
    })
  })

  it('should return an error', (done) => {
    window.fetch = mockFetchFail
    getStatistics({
      productIds: ['product1', 'product2', 'product3'],
      environment: 'qa',
      key: 'clients_api_key',
      type: 'Reviews',
      filters: {
        ContentLocale: 'en_US'
      }
    }).then(() => {}, error => {
      expect(error.Message).to.equal('An error occurred.')
      done()
    })
  })

  it('should return ERROR_UNKNOWN error if error is missing from response', (done) => {
    window.fetch = mockFetchFailMissingError
    getStatistics({
      productIds: ['product1', 'product2', 'product3'],
      environment: 'qa',
      key: 'clients_api_key',
      type: 'Reviews',
      filters: {
        ContentLocale: 'en_US'
      }
    }).then(() => {}, error => {
      expect(error.Message).to.equal('An unknown error occurred.')
      expect(error.Code).to.equal('ERROR_UNKNOWN')
      done()
    })
  })
})
