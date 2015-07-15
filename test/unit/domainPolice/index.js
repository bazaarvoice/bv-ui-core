/**
 * @fileOverview Unit tests for the Domain Police module
 */
var tap = require('tap');
var domainPolice = require('../../../lib/domainPolice');

// For each of these domains:
// - domain: The domain to test against.
// - value: The expected return value from domainPolice.
var domainsToTest = [
  { domain : 'localhost.bazaarvoice.com', allowed : '.bazaarvoice.com', cookie : true },
  { domain : 'foo.localhost.bazaarvoice.com', allowed : '.bazaarvoice.com', cookie : true },
  { domain : 'no-prefixing-dot.foo.com', allowed : 'no-prefixing-dot.foo.com', cookie : true },
  { domain : 'foo.com', allowed : undefined, cookie : false },
  { domain : 'bar.com', allowed : undefined, cookie : false },
  { domain : 'ec2-54-234-131-1.compute-1.amazonaws.com', allowed : '.ec2-54-234-131-1.compute-1.amazonaws.com', cookie : false },
  { domain : 'www.ec2-54-234-131-1.compute-1.amazonaws.com', allowed : '.ec2-54-234-131-1.compute-1.amazonaws.com', cookie : false },
  { domain : 'compute-1.amazonaws.com', allowed : undefined, cookie : false },
  { domain : 'localhost', allowed : '.localhost', cookie : false },
  // Note that for IP tests, valid IPs should return without the leading period.
  { domain : '172.16.0.5', allowed : '172.16.0.5', cookie : true },
  { domain : '192.168.10.10', allowed : undefined, cookie : false }
];

var allowedDomains = [
  {
    domainAddress : '.bazaarvoice.com',
    thirdPartyCookieEnabled : true
  },
  {
    domainAddress : '.ec2-54-234-131-1.compute-1.amazonaws.com',
    thirdPartyCookieEnabled : false
  },
  {
    domainAddress : '.172.16.0.5',
    thirdPartyCookieEnabled : true
  },
  {
    domainAddress : '.localhost',
    thirdPartyCookieEnabled : false
  },
  {
    domainAddress : 'no-prefixing-dot.foo.com',
    thirdPartyCookieEnabled : true
  }
];

var domainUnderTest;
var domain;
var httpDomain;
var httpsDomain;
var httpPortDomain;
var httpsPortDomain;
var domainAllowed;
var verb;
var cookieEnabled;

tap.test('Testing allowedDomain', function (t) {
  for (var i = 0, l = domainsToTest.length; i < l; i++) {
    // Pull some values
    domainUnderTest = domainsToTest[i];
    domain = domainUnderTest.domain;
    domainAllowed = domainUnderTest.allowed;
    cookieEnabled = domainUnderTest.cookie;

    // Set up domains for use in testing
    httpDomain = 'http://' + domain;
    httpsDomain = 'https://' + domain;
    httpPortDomain = httpDomain + ':4000';
    httpsPortDomain = httpsDomain + ':8000';

    // For Allowed Domain Testing
    verb = typeof domainAllowed === 'undefined' ? 'disallow' : 'allow';

    t.test('Testing ' + domain + ' for allowance', function (tt) {
      tt.equal(domainPolice.allowedDomain(domain, allowedDomains), domainAllowed, 'should ' + verb + ' ' + domain + ' without protocol or port');
      tt.equal(domainPolice.allowedDomain(httpDomain, allowedDomains), domainAllowed, 'should ' + verb + ' ' + domain + ' as HTTP with no port');
      tt.equal(domainPolice.allowedDomain(httpsDomain, allowedDomains), domainAllowed, 'should ' + verb + ' ' + domain + ' as HTTPS with no port');
      tt.equal(domainPolice.allowedDomain(httpPortDomain, allowedDomains), domainAllowed, 'should ' + verb + ' ' + domain + ' as HTTP with a port of 4000');
      tt.equal(domainPolice.allowedDomain(httpsPortDomain), domainAllowed, 'should ' + verb + ' ' + domain + ' as HTTPS with a port of 8000');
      tt.end();
    });

    // For Third Party Cookies Enabled Testing
    verb = cookieEnabled ? 'disallow' : 'allow';

    t.test('Testing ' + domain + ' for third party cookies', function (tt) {
      tt.equal(domainPolice.thirdPartyCookieEnabled(domain, allowedDomains), cookieEnabled, 'should ' + verb + ' cookies on ' + domain + ' without protocol or port');
      tt.equal(domainPolice.thirdPartyCookieEnabled(httpDomain, allowedDomains), cookieEnabled, 'should ' + verb + ' cookies on ' + domain + ' as HTTP with no port');
      tt.equal(domainPolice.thirdPartyCookieEnabled(httpsDomain, allowedDomains), cookieEnabled, 'should ' + verb + ' cookies on ' + domain + ' as HTTPS with no port');
      tt.equal(domainPolice.thirdPartyCookieEnabled(httpPortDomain, allowedDomains), cookieEnabled, 'should ' + verb + ' cookies on ' + domain + ' as HTTP with a port of 4000');
      tt.equal(domainPolice.thirdPartyCookieEnabled(httpsPortDomain), cookieEnabled, 'should ' + verb + ' cookies on ' + domain + ' as HTTPS with a port of 8000');
      tt.end();
    });
  }

  t.end();
});
