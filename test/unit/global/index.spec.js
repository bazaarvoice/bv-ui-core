/**
 * @fileOverview
 * Unit tests for the global module.
 */

// Includes.
var global = require('../../../lib/global');

describe('lib/global', function () {

  it('should export window', function () {
    // If we have access to the window object, compare against it.
    if (typeof window !== 'undefined') {
      expect(global).to.eql(window);
    }
  });

  it('should export window with default pointing to windows if __esModule is set', function () {
    // If we have access to the window object, compare against it.
    if (typeof window !== 'undefined') {
      window.__esModule = true
      var global = require('../../../lib/global')
      expect(global).to.eql(window);
    }
  });

  it('should not wrap window in a Proxy when globalObj is window even if __esModule is set', function () {
    if (typeof window !== 'undefined') {
      window.__esModule = true;
      var result = require('../../../lib/global');
      // When globalObj === window, the proxy branch should be skipped,
      // so the result should be strictly equal to window.
      expect(result).to.equal(window);
      delete window.__esModule;
    }
  });

  it('should return the global object directly when __esModule is not set', function () {
    if (typeof window !== 'undefined') {
      delete window.__esModule;
      var result = require('../../../lib/global');
      expect(result).to.equal(window);
    }
  });

});
