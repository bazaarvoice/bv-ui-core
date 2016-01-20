/**
 * @file Unit tests for region module
 */

var region = require('../../../lib/region');


describe('lib/region', function () {

  describe('#isEULocale', function () {

    it('should return false for en_US', function () {
      var result = region.isEULocale('en_US');
      expect(result).to.equal(false);
    });

    it('should return false for US', function () {
      var result = region.isEULocale('US');
      expect(result).to.equal(false);
    });

    it('should return true for en_GB', function () {
      var result = region.isEULocale('en_GB');
      expect(result).to.equal(true);
    });

    it('should return true for GB', function () {
      var result = region.isEULocale('GB');
      expect(result).to.equal(true);
    });
  });
});
