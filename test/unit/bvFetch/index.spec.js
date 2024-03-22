//Imports

var BvFetch = require('../../../lib/bvFetch');

describe('BvFetch', function () {
  let bvFetchInstance;
  
  beforeEach(function () {
    bvFetchInstance = new BvFetch({
      errorHandler: null,
      cacheName: 'testCache'
    });

    // Define cacheStorage as a Map
    this.cacheStorage = new Map();

    // Stubbing caches.open
    sinon.stub(caches, 'open').resolves({
      match: key => {
        const cachedResponse = this.cacheStorage.get(key);
        return Promise.resolve(cachedResponse);
      },
      put: (key, response) => {
        this.cacheStorage.set(key, response);
        return Promise.resolve();
      }
    });
  });
  
  afterEach(function () {
    bvFetchInstance = null;
    // Restore the original method after each test
    caches.open.restore();
  });
  
  it('should generate correct cache key', function () {
    const url = 'https://jsonplaceholder.typicode.com/todos';
    const options = {};
    const expectedKey = 'https://jsonplaceholder.typicode.com/todos';
    const generatedKey = bvFetchInstance.generateCacheKey(url, options);
    expect(generatedKey).to.equal(expectedKey);
  });
  
  it('should fetch from network when cache miss', function (done) {
    const url = 'https://jsonplaceholder.typicode.com/todos';
    const options = {};
  
    bvFetchInstance.bvFetchFunc(url, options)
        .then(response => {
          // Check if response is fetched from network
          expect(response).to.not.be.null;
          done();
        })
        .catch(done);
  });
  
  it('should fetch from cache when cache hit and not expired', function (done) {
    const url = 'https://jsonplaceholder.typicode.com/todos';
    const options = {};
  
    // Mocking cache response
    const mockResponse = new Response('Mock Data', {
      status: 200,
      statusText: 'OK',
      headers: {
        'Cache-Control': 'max-age=3600',
        'X-Cached-Time': Date.now()
      }
    });
  
    // Overriding the stub for this specific test case
    caches.open.resolves({
      match: () => Promise.resolve(mockResponse),
      put: (key, response) => {
        this.cacheStorage.set(key, response);
        return Promise.resolve();
      }
    });
  
    bvFetchInstance.bvFetchFunc(url, options)
        .then(response => {
          // Check if response is fetched from cache
          expect(response).to.not.be.null;
          done();
        })
        .catch(done);
  });
  
  it('should fetch from network when cache hit but expired', function (done) {
    const url = 'https://jsonplaceholder.typicode.com/todos';
    const options = {};
  
    // Mocking cache response with expired cache
    const mockResponse = new Response('Mock Data', {
      status: 200,
      statusText: 'OK',
      headers: {
        'Cache-Control': 'max-age=10', // Expired cache
        'X-Cached-Time': Date.now() - 20000 // Older than TTL
      }
    });
  
    // Overriding the stub for this specific test case
    caches.open.resolves({
      match: () => Promise.resolve(mockResponse),
      put: (key, response) => {
        this.cacheStorage.set(key, response);
        return Promise.resolve();
      }
    });
  
    bvFetchInstance.bvFetchFunc(url, options)
        .then(response => {
          // Check if response is fetched from network
          expect(response).to.not.be.null;
          done();
        })
        .catch(done);
  });
  
});
