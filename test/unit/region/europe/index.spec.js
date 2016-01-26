/**
 * @file Unit tests for EU region module
 */

var europe = require('../../../../lib/region/europe');

describe('lib/region/europe', function () {

  describe('#hasTerritory', function () {

    it('should throw an error for en_US', function () {
      expect(function () {
        europe.hasTerritory('en_US');
      }).to.throw();
    });

    it('should throw an error for fr', function () {
      expect(function () {
        europe.hasTerritory('fr');
      }).to.throw();
    });

    it('should return false for US', function () {
      var result = europe.hasTerritory('US');
      expect(result).to.equal(false);
    });

    it('should return true for GB', function () {
      var result = europe.hasTerritory('GB');
      expect(result).to.equal(true);
    });
  });

  describe('#hasLocale', function () {

    it('should throw an error for US', function () {
      expect(function () {
        europe.hasLocale('US');
      }).to.throw();
    });

    it('should return false for en_US', function () {
      var result = europe.hasLocale('en_US');
      expect(result).to.equal(false);
    });

    it('should return false for en-US', function () {
      var result = europe.hasLocale('en-US');
      expect(result).to.equal(false);
    });

    it('should return true for en_GB', function () {
      var result = europe.hasLocale('en_GB');
      expect(result).to.equal(true);
    });

    it('should return true for en-GB', function () {
      var result = europe.hasLocale('en-GB');
      expect(result).to.equal(true);
    });
  });

  describe('#listTerritories', function () {

    it('should return an array', function () {
      var result = europe.listTerritories();
      expect(result).to.be.an('array');
    });
  });
});
