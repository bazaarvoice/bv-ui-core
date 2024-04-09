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
        return Promise.resolve(mockResponse)
      },
      put: (key, response) => {
        cacheStorage.set(key, response);
        return Promise.resolve();
      }
    });
  
    // Simulate that the response is cached
    bvFetchInstance.cachedUrls.add(cacheKey);
    
    // Call the function under test
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

    const matchSpy = sinon.spy((key) => {
      expect(key).to.equal(cacheKey); 
      Promise.resolve(null)
    });
    caches.open.resolves({
      match: matchSpy,
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
        expect(matchSpy.called).to.be.false;

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

  it('should delete cache when size is greater than 10 MB', function (done) {
    // Mock cache entries exceeding 10 MB
    const mockCacheEntries = [
      { key: 'key1', size: 6000000 }, // 6 MB
      { key: 'key2', size: 6000000 }  // 6 MB
      // Add more entries as needed to exceed 10 MB
    ];
  
    // Stub cache operations
    const deleteSpy = sinon.spy(
      (key) => {
        const index = mockCacheEntries.findIndex(entry => entry.key === key);
        if (index !== -1) {
          mockCacheEntries.splice(index, 1); // Delete entry from mock cache entries
        }
        return Promise.resolve(true);
      }
    )
    caches.open.resolves({
      keys: () => Promise.resolve(mockCacheEntries.map(entry => entry.key)),
      match: (key) => {
        const entry = mockCacheEntries.find(entry => entry.key === key);
        if (entry) {
          return Promise.resolve({
            headers: new Headers({
              'X-Bazaarvoice-Response-Size': entry.size.toString(),
              'X-Bazaarvoice-Cached-Time': Date.now(),
              'Cache-Control': 'max-age=3600'
            })
          });
        } 
        else {
          return Promise.resolve(null);
        }
      },
      delete: deleteSpy
    });
  
    // Create a new instance of BvFetch
    const bvFetchInstance = new BvFetch({ shouldCache: true });
  
    // Call manageCache function
    bvFetchInstance.manageCache()
    setTimeout(() => {
      // Ensure cache deletion occurred until the total size is under 10 MB
      const totalSizeAfterDeletion = mockCacheEntries.reduce((acc, entry) => acc + entry.size, 0);
      expect(totalSizeAfterDeletion).to.be.at.most(10 * 1024 * 1024); // Total size should be under 10 MB
      // Ensure cache.delete was called for each deleted entry
      expect(deleteSpy.called).to.be.true;
      expect(deleteSpy.callCount).to.equal(mockCacheEntries.length);
      done();
    }, 500);
      
  });  
  
});
