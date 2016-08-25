var api = require('../../../lib/api')

describe('api', function () {
  let oldFetch

  before(() => {
    oldFetch = window.fetch
    window.fetch = () => {}
  })

  after(() => {
    window.fetch = oldFetch
  })

  describe('get', () => {
    it('should throw if unsupported type', () => {
      expect(function () {
        api.get('foo')
      }).to.throw('Unsupported method: foo')
    })
    it('should works for statistics', () => {
      api.get('statistics', {
        productIds: ['product1', 'product2', 'product3'],
        environment: 'qa',
        key: 'clients_api_key',
        type: 'Reviews',
        filters: {
          ContentLocale: 'en_US'
        }
      })
    })
  })
})
