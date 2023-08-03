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

});
