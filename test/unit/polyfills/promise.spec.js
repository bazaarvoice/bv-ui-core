/**
 * @fileOverview
 * Unit tests for the Promise polyfill module.
 */

var global = require('../../../lib/global');

describe('lib/polyfills/promise', function () {
  var nativeSupport = function () {
    console.log('[native code]');
  };

  it('does not polyfill when natively supported', function () {
    var Promise = global.Promise;

    global.Promise = nativeSupport;

    var PromiseModule = require('../../../lib/polyfills/promise');

    expect(PromiseModule).to.equal(nativeSupport);

    global.Promise = Promise;

    // Clear the require cache for the next time it's required
    delete require.cache[require.resolve('../../../lib/polyfills/promise')];
  });

  it('polyfills when not natively supported', function () {
    var Promise = global.Promise;

    global.Promise = undefined;

    var PromiseModule = require('../../../lib/polyfills/promise');

    expect(PromiseModule).not.to.equal(nativeSupport);

    // Verify that we didn't pollute the global namespace
    expect(global.Promise).to.equal(undefined);

    // Now that we've polyfilled, we can check this
    expect(PromiseModule).to.be.a('function');

    global.Promise = Promise;

    // Clear the require cache for the next time it's required
    delete require.cache[require.resolve('../../../lib/polyfills/promise')];
  });
})
