/**
 * @file Unit tests for EU region module
 */

var europe = require('../../../../lib/region/europe');

describe('lib/region/europe', function () {

  describe('#has', function () {

    it('should return false for en_US', function () {
      var result = europe.has('en_US');
      expect(result).to.equal(false);
    });

    it('should return false for en-US', function () {
      var result = europe.has('en-US');
      expect(result).to.equal(false);
    });

    it('should return false for US', function () {
      var result = europe.has('US');
      expect(result).to.equal(false);
    });

    it('should return true for en_GB', function () {
      var result = europe.has('en_GB');
      expect(result).to.equal(true);
    });

    it('should return true for en-GB', function () {
      var result = europe.has('en-GB');
      expect(result).to.equal(true);
    });

    it('should return true for GB', function () {
      var result = europe.has('GB');
      expect(result).to.equal(true);
    });

    // Just spot checking some EU locales.
    it('should return true for ES', function () {
      var result = europe.has('ES');
      expect(result).to.equal(true);
    });

    it('should return true for IT', function () {
      var result = europe.has('IT');
      expect(result).to.equal(true);
    });
  });

  describe('#listCountryCodes', function () {

    it('should return an array', function () {
      var result = europe.listCountryCodes();
      expect(result).to.be.an('array');
    });
  });
});
