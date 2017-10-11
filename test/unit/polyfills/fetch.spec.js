/**
 * @fileOverview
 * Unit tests for the fetch polyfill module.
 */

var global = require('../../../lib/global');

describe('lib/polyfills/fetch', function () {
  var nativeSupport = function () {
    console.log('[native code]');
  };

  it('does not polyfill when natively supported', function () {
    var fetch = global.fetch;

    global.fetch = nativeSupport;

    var fetchModule = require('../../../lib/polyfills/fetch');

    // Test default export
    expect(fetchModule).to.equal(nativeSupport);

    // Test named exports
    expect(fetchModule.fetch).to.equal(nativeSupport);

    // If we have native fetch support, we can also check these
    if (fetch) {
      expect(fetchModule.fetch).to.be.a('function');
      expect(fetchModule.Headers).to.be.a('function');
      expect(fetchModule.Request).to.be.a('function');
      expect(fetchModule.Response).to.be.a('function');
    }

    global.fetch = fetch;

    // Clear the require cache for the next time it's required
    delete require.cache[require.resolve('../../../lib/polyfills/fetch')];
  });

  it('polyfills when not natively supported', function () {
    var fetch = global.fetch;

    global.fetch = undefined;

    var fetchModule = require('../../../lib/polyfills/fetch');

    // Test default export
    expect(fetchModule).not.to.equal(nativeSupport);

    // Test named exports
    expect(fetchModule.fetch).not.to.equal(nativeSupport);

    // Verify that we didn't pollute the global namespace
    expect(global.fetch).to.equal(undefined);

    // Now that we've polyfilled, we can check these
    expect(fetchModule.fetch).to.be.a('function');
    expect(fetchModule.Headers).to.be.a('function');
    expect(fetchModule.Request).to.be.a('function');
    expect(fetchModule.Response).to.be.a('function');

    global.fetch = fetch;

    // Clear the require cache for the next time it's required
    delete require.cache[require.resolve('../../../lib/polyfills/fetch')];
  });
})
