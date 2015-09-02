/**
 * @fileOverview
 * Unit tests for the body module.
 */

// Imports.
var body = require('../../../lib/body');

describe('lib/body', function () {

  it('Should return the body', function () {
    expect(body().tagName).to.equal('BODY');
  });

});
