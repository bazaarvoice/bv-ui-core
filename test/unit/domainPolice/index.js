/**
 * @fileOverview Unit tests for the Domain Police module
 */
var test = require('tape');
var domainPolice = require('../../../lib/domainPolice');

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

// A simple function used to test a domain in the above domainsToTest
function testDomain (domainUnderTest) {
  var domain = domainUnderTest.domain;

  // Domain variations to test
  var domains = [
    domain,
    'http://' + domain,
    'https://' + domain,
    'http://' + domain + ':4000',
    'https://' + domain + ':8000'
  ];

  test('Testing ' + domain, function (t) {
    var dp;
    for (var i = 0, l = domains.length; i < l; i++) {
      dp = domainPolice(domains[i], allowedDomains);

      t.equal(dp.isValid, domainUnderTest.isValid, 'Domain isValid === ' + domainUnderTest.isValid);
      t.equal(dp.get('domain'), domainUnderTest.matchedDomain, 'domain is ' + domainUnderTest.matchedDomain);
      t.equal(dp.get('thirdPartyCookieEnabled'), domainUnderTest.thirdPartyCookieEnabled, 'thirdPartyCookieEnabled is ' + domainUnderTest.thirdPartyCookieEnabled);
      t.equal(dp.get('commentsEnabled'), domainUnderTest.commentsEnabled, 'commentsEnabled is ' + domainUnderTest.commentsEnabled);
    }

    t.end();
  });
}

// Run the tests on each domain
for (var i = 0, l = domainsToTest.length; i < l; i++) {
  testDomain(domainsToTest[i]);
}
