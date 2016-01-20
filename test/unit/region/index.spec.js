/**
 * @file Unit tests for region module
 */

var region = require('../../../lib/region');


describe('lib/region', function () {

  describe('#hasTerritory', function () {

    it('should throw an error for en_US and europe', function () {
      expect(function () {
        region.hasTerritory('europe', 'en_US');
      }).to.throw();
    });

    it('should throw an error for US and bananarama', function () {
      expect(function () {
        region.hasTerritory('bananarama', 'US');
      }).to.throw();
    });

    it('should throw an error for fr and europe', function () {
      expect(function () {
        region.hasTerritory('europe', 'fr');
      }).to.throw();
    });

    it('should return false for US and europe', function () {
      var result = region.hasTerritory('europe', 'US');
      expect(result).to.equal(false);
    });

    it('should return true for GB and europe', function () {
      var result = region.hasTerritory('europe', 'GB');
      expect(result).to.equal(true);
    });
  });

  describe('#hasLocale', function () {

    it('should throw an error for US and europe', function () {
      expect(function () {
        region.hasLocale('europe', 'US');
      }).to.throw();
    });

    it('should throw an error for en_US and bananarama', function () {
      expect(function () {
        region.hasLocale('bananarama', 'en_US');
      }).to.throw();
    });

    it('should return false for en_US and europe', function () {
      var result = region.hasLocale('europe', 'en_US');
      expect(result).to.equal(false);
    });

    it('should return false for en-US and europe', function () {
      var result = region.hasLocale('europe', 'en-US');
      expect(result).to.equal(false);
    });

    it('should return true for en_GB and europe', function () {
      var result = region.hasLocale('europe', 'en_GB');
      expect(result).to.equal(true);
    });

    it('should return true for en-GB and europe', function () {
      var result = region.hasLocale('europe', 'en-GB');
      expect(result).to.equal(true);
    });
  });

  describe('#lookupTerritory', function () {

    it('should throw an error for en_US', function () {
      expect(function () {
        region.lookupTerritory('en_US');
      }).to.throw();
    });

    it('should return europe for GB', function () {
      var result = region.lookupTerritory('GB');
      expect(result).to.eql('europe');
    });

    it('should return "unsupported" for US', function () {
      var result = region.lookupTerritory('US');
      expect(result).to.eql('unsupported');
    });
  });

  describe('#lookupLocale', function () {

    it('should throw an error for US', function () {
      expect(function () {
        region.lookupLocale('US');
      }).to.throw();
    });

    it('should return europe for en_GB', function () {
      var result = region.lookupLocale('en_GB');
      expect(result).to.eql('europe');
    });

    it('should return "unsupported" for en_US', function () {
      var result = region.lookupLocale('en_US');
      expect(result).to.eql('unsupported');
    });
  });
});
