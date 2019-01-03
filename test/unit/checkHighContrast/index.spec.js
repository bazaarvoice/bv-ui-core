/**
 * @fileOverview
 * Unit tests for the checkHighContrast utility.
 */

// Imports.
var global = require('../../../lib/global');
var checkHighContrast = require('../../../lib/checkHighContrast');

describe('lib/checkHighContrast', function () {

  it('normally returns false', function () {
    expect(checkHighContrast(global.document.body)).to.equal(false);
  });

});
