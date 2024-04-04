//Imports

var BvFetch = require('../../../lib/bvFetch');

describe('BvFetch', function () {
  let bvFetchInstance;
  let cacheStub;
  let cacheStorage;
  
  beforeEach(function () {
    bvFetchInstance = new BvFetch({
      shouldCache: null,
      cacheName: 'testCache'
    });

    // Define cacheStorage as a Map
    cacheStorage = new Map();

    // Stubbing caches.open
    cacheStub = sinon.stub(caches, 'open').resolves({
      match: key => {
        const cachedResponse = cacheStorage.get(key);
        return Promise.resolve(cachedResponse);
      },
      put: (key, response) => {
        cacheStorage.set(key, response);
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

  
  it('should fetch from cache when the response is cached', function (done) {
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

    const cacheKey = bvFetchInstance.generateCacheKey(url, options);
  
    // Overriding the stub for this specific test case
    caches.open.resolves({
      match: (key) => {
        expect(key).to.equal(cacheKey); 
        Promise.resolve(mockResponse)
      },
      put: (key, response) => {
        cacheStorage.set(key, response);
        return Promise.resolve();
      }
    });
  
    bvFetchInstance.bvFetchFunc(url, options)
    .then(response => {
      // Check if response is fetched from cache
      expect(response).to.not.be.null;

       // Check if response is cached
      const cachedResponse = cacheStorage.get(cacheKey);
      expect(cachedResponse).to.not.be.null;

      // Check if caches.open was called
      expect(cacheStub.called).to.be.true;

      done();
    })
    .catch(error => {
      done(error); // Call done with error if any
    })
  });
  

  it('should fetch from network when response is not cached', function (done) {
    const url = 'https://jsonplaceholder.typicode.com/todos';
    const options = {};

    const cacheKey = bvFetchInstance.generateCacheKey(url, options);
  
    caches.open.resolves({
      match: (key) => {
        expect(key).to.equal(cacheKey); 
        Promise.resolve(null)
      },
      put: (key, response) => {
        cacheStorage.set(key, response);
        return Promise.resolve();
      }
    });
   

    bvFetchInstance.bvFetchFunc(url, options)
      .then(response => {
        // Check if response is fetched from network
        expect(response).to.not.be.null;
        console.log(response.body)
        
        // Check if caches.match was called
        expect(cacheStub.called).to.be.true;

        done();
      })
      .catch(done);
  });

  it('should not cache response when there is an error', function (done) {
    const url = 'https://jsonplaceholder.typicode.com/todos';
    const options = {};

    // Define shouldCache directly in bvFetchInstance
    bvFetchInstance.shouldCache = (res) => {
      return false
    };
 
    bvFetchInstance.bvFetchFunc(url, options)
    .then(response => {
      // Check if response is fetched from network
      expect(response).to.not.be.null;
      console.log(response.body)

      // Check if caches.match was called
      expect(cacheStub.calledOnce).to.be.false;

      // Check if response is not cached
      const cachedResponse = cacheStorage.get(url);
      expect(cachedResponse).to.be.undefined;

      done();
    })
    .catch(done);
  });

  
});
