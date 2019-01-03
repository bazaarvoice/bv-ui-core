/**
 * @fileOverview
 * Unit tests for the Domain Police module.
 */

// Includes.
var domainPolice = require('../../../lib/domainPolice');

describe('lib/domainPolice', function () {

  // For each of these domains:
  // - domain: The domain to test against.
  // - matchedDomain: The expected return value of 'domain'
  // - isValid: The expected return value from domainPolice.
  var domainsToTest = [
    {
      domain: 'localhost.bazaarvoice.com',
      matchedDomain: '.bazaarvoice.com',
      isValid: true,
      thirdPartyCookieEnabled: true,
      commentsEnabled: true
    },
    {
      domain: 'foo.localhost.bazaarvoice.com',
      matchedDomain: '.bazaarvoice.com',
      isValid: true,
      thirdPartyCookieEnabled: true,
      commentsEnabled: true
    },
    {
      domain: 'no-prefixing-dot.foo.com',
      matchedDomain: 'no-prefixing-dot.foo.com',
      isValid: true,
      thirdPartyCookieEnabled: true
    },
    {
      domain: 'www.no-prefixing-dot.foo.com',
      matchedDomain: 'no-prefixing-dot.foo.com',
      isValid: true,
      thirdPartyCookieEnabled: true
    },
    {
      domain: 'foo.com',
      matchedDomain: undefined,
      isValid: false
    },
    {
      domain: 'bar.com',
      matchedDomain: undefined,
      isValid: false
    },
    {
      domain: 'ec2-54-234-131-1.compute-1.amazonaws.com',
      matchedDomain: '.ec2-54-234-131-1.compute-1.amazonaws.com',
      isValid: true,
      thirdPartyCookieEnabled: false,
      commentsEnabled: true
    },
    {
      domain: 'www.ec2-54-234-131-1.compute-1.amazonaws.com',
      matchedDomain: '.ec2-54-234-131-1.compute-1.amazonaws.com',
      isValid: true,
      thirdPartyCookieEnabled: false,
      commentsEnabled: true
    },
    {
      domain: 'compute-1.amazonaws.com',
      matchedDomain: undefined,
      isValid: false
    },
    {
      domain: 'localhost',
      matchedDomain: '.localhost',
      isValid: true,
      thirdPartyCookieEnabled: false
    },
    {
      domain: '172.16.0.5',
      matchedDomain: '172.16.0.5',
      isValid: true,
      thirdPartyCookieEnabled: true,
      commentsEnabled: false
    },
    {
      domain: '192.168.10.10',
      matchedDomain: undefined,
      isValid: false
    }
  ];

  // There is very intentional variation on what each domain in the allowedDomains set includes,
  // in order to make testing more interesting
  var allowedDomains = [
    {
      domain: '.bazaarvoice.com',
      thirdPartyCookieEnabled: true,
      commentsEnabled: true
    },
    {
      domain: '.ec2-54-234-131-1.compute-1.amazonaws.com',
      thirdPartyCookieEnabled: false,
      commentsEnabled: true
    },
    {
      domain: '.172.16.0.5',
      thirdPartyCookieEnabled: true,
      commentsEnabled: false
    },
    {
      domain: '.localhost',
      thirdPartyCookieEnabled: false
    },
    {
      domain: 'no-prefixing-dot.foo.com',
      thirdPartyCookieEnabled: true
    }
  ];

  it('produces correct results for all test domains', function () {

    /**
     * A utility function used to test a domain.
     */
    function testDomain (domainUnderTest) {
      var domain = domainUnderTest.domain;

      var dp = domainPolice(allowedDomains.slice(0), domain);

      expect(dp.isValid).to.equal(domainUnderTest.isValid);
      expect(dp.get('domain')).to.equal(domainUnderTest.matchedDomain);
      expect(dp.get('thirdPartyCookieEnabled')).to.equal(domainUnderTest.thirdPartyCookieEnabled);
      expect(dp.get('commentsEnabled')).to.equal(domainUnderTest.commentsEnabled);
    }

    // Run the tests on each domain
    for (var i = 0, l = domainsToTest.length; i < l; i++) {
      testDomain(domainsToTest[i]);
    }
  });

});
