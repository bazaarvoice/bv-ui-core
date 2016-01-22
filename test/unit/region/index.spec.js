/**
 * @file Unit tests for region module
 */

var region = require('../../../lib/region');


describe('lib/region', function () {

  describe('#has', function () {

    it('should return false for en_US and europe', function () {
      var result = region.has('en_US', 'europe');
      expect(result).to.equal(false);
    });

    it('should return false for en-US and europe', function () {
      var result = region.has('en-US', 'europe');
      expect(result).to.equal(false);
    });

    it('should return false for US and europe', function () {
      var result = region.has('US', 'europe');
      expect(result).to.equal(false);
    });

    it('should return true for en_GB and europe', function () {
      var result = region.has('en_GB', 'europe');
      expect(result).to.equal(true);
    });

    it('should return true for en-GB and europe', function () {
      var result = region.has('en-GB', 'europe');
      expect(result).to.equal(true);
    });

    it('should return true for GB and europe', function () {
      var result = region.has('GB', 'europe');
      expect(result).to.equal(true);
    });

    it('should return false if no region is provided', function () {
      var result = region.has('en_GB');
      expect(result).to.equal(false);
    });
  });

  describe('#lookup', function () {

    it('should return europe for en_GB', function () {
      var result = region.lookup('en_GB');
      expect(result).to.eql('europe');
    });

    it('should return europe for GB', function () {
      var result = region.lookup('GB');
      expect(result).to.eql('europe');
    });

    it('should return "unsupported region" for en_US', function () {
      var result = region.lookup('en_US');
      expect(result).to.eql('unsupported region');
    });
  });
});
