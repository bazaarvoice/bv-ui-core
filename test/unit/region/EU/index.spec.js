/**
 * @file Unit tests for EU region module
 */

var isEULocale = require('../../../../lib/region/EU');

describe('lib/region/EU', function () {

  it('should return false for en_US', function () {
    var result = isEULocale('en_US');
    expect(result).to.equal(false);
  });

  it('should return false for en-US', function () {
    var result = isEULocale('en-US');
    expect(result).to.equal(false);
  });

  it('should return false for US', function () {
    var result = isEULocale('US');
    expect(result).to.equal(false);
  });

  it('should return true for en_GB', function () {
    var result = isEULocale('en_GB');
    expect(result).to.equal(true);
  });

  it('should return true for en-GB', function () {
    var result = isEULocale('en-GB');
    expect(result).to.equal(true);
  });

  it('should return true for GB', function () {
    var result = isEULocale('GB');
    expect(result).to.equal(true);
  });

  // Just spot checking some EU locales.
  it('should return true for ES', function () {
    var result = isEULocale('ES');
    expect(result).to.equal(true);
  });

  it('should return true for IT', function () {
    var result = isEULocale('IT');
    expect(result).to.equal(true);
  });

  it('should return true for IT', function () {
    var result = isEULocale('IT');
    expect(result).to.equal(true);
  });
});
