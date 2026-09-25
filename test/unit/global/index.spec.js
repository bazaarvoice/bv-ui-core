/**
 * @fileOverview
 * Unit tests for the global module.
 */

// Includes.
var global = require('../../../lib/global');

// The module under test computes its result once at require-time, and
// webpack (like Node) caches a module's exports by request string. Re-requiring
// '../../../lib/global' after mutating window.__esModule would therefore just
// return the already-cached, unpolluted result instead of re-evaluating the
// module. Each test below requires the module via its own literal query
// string, which webpack treats as a distinct module instance, so the module
// body actually re-runs against the current (mutated) window state. The
// query string must be a static literal (not computed) for webpack to
// resolve it.

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
      var result = require('../../../lib/global?case=default-pointer');
      expect(result.default).to.equal(window);
      delete window.__esModule;
    }
  });

  it('should wrap window in a Proxy when __esModule is set, even when globalObj is window', function () {
    if (typeof window !== 'undefined') {
      window.__esModule = true;
      var result = require('../../../lib/global?case=proxy-wrap');
      // The Proxy is needed so that native/branded methods (e.g.
      // getComputedStyle) can be bound back to the real window before
      // being returned, and so that `.default` interop lookups keep working.
      // Note: we deliberately avoid a deep .eql(window) check here, since
      // window contains circular references (e.g. window.window) that
      // chai/karma's assertion reporting cannot serialize.
      expect(result).to.not.equal(window);
      expect(result.location).to.equal(window.location);
      delete window.__esModule;
    }
  });

  it('should bind functions read off the Proxy to the real window so native methods work', function () {
    if (typeof window !== 'undefined') {
      window.__esModule = true;
      var result = require('../../../lib/global?case=bound-methods');
      // Calling a native/branded method via the Proxy receiver would
      // otherwise throw "TypeError: Illegal invocation".
      expect(function () {
        result.getComputedStyle(document.body);
      }).to.not.throw();
      delete window.__esModule;
    }
  });

  it('should return the real target for the "default" property (esModule interop)', function () {
    if (typeof window !== 'undefined') {
      window.__esModule = true;
      var result = require('../../../lib/global?case=default-interop');
      expect(result.default).to.equal(window);
      delete window.__esModule;
    }
  });

  it('should return the global object directly when __esModule is not set', function () {
    if (typeof window !== 'undefined') {
      delete window.__esModule;
      var result = require('../../../lib/global?case=no-pollution');
      expect(result).to.equal(window);
    }
  });

});
