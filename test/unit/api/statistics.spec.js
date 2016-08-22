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

let getStatistics = require('../../../lib/api/statistics')

describe('getStatistics', () => {
  const oldFetch = window.fetch

  after(() => {
    window.fetch = oldFetch
  })

  beforeEach(() => {
    window.fetch = mockFetchSuccess
  })

  it('should throw if not provided options', () => {
    expect(() => getStatistics()).to.throw('options must be provided')
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

  it('should return an error\'s message', (done) => {
    window.fetch = mockFetchFail
    getStatistics({
      productIds: ['product1', 'product2', 'product3'],
      environment: 'qa',
      key: 'clients_api_key',
      type: 'Reviews',
      filters: {
        ContentLocale: 'en_US'
      }
    }).then(() => {}, reason => {
      expect(reason).to.equal('An error occurred.')
      done()
    })
  })
})
