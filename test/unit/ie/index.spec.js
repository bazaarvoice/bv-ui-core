/**
 * @fileOverview
 * Unit tests for the ie module.
 */

describe('lib/ie', function () {

  it('does not throw when required', function () {
    expect(function () {
      require('../../../lib/ie');
    }).to.not.throw(Error);
  });

});
