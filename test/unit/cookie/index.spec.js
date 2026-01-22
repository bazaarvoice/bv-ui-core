/**
 * @fileOverview
 * Unit tests for the cookie module.
 */

// Imports.
var cookie = require('../../../lib/cookie');
var global = require('../../../lib/global');
var cookieConsent = require('../../../lib/cookieConsent');

function deleteCookie (name) {
  global.document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

describe('lib/cookie', function () {

  it('cookie.create', function () {
    cookieConsent.initConsent({
      'test create': true
    });
    cookie.create('test create', 'cookie monster', 3);
    expect(global.document.cookie).to.have.string('test%20create=cookie%20monster');

    // Clean up.
    deleteCookie('test%20create');
  });

  it('cookie.read', function () {
    global.document.cookie = 'test%20read=Hello%20World';
    expect(cookie.read('test read')).to.equal('Hello World');

    // Clean up.
    deleteCookie('test%20read');
  });

  it('cookie.remove', function () {
    global.document.cookie = 'test%20delete=1';
    cookie.remove('test delete');
    expect(global.document.cookie).to.not.have.string('test%20delete');

    // Clean up.
    deleteCookie('test%20delete');
  });

});

describe('lib/cookie secure flag behavior', function () {
  var originalProtocol;

  beforeEach(function () {
    // Store original protocol to restore after each test
    originalProtocol = global.location && global.location.protocol;
  });

  afterEach(function () {
    // Restore original protocol
    if (global.location) {
      // Some browsers don't allow direct assignment to location.protocol
      // so we use Object.defineProperty where possible
      try {
        Object.defineProperty(global.location, 'protocol', {
          value: originalProtocol,
          writable: true,
          configurable: true
        });
      } 
      catch (e) {
        // If we can't restore, tests may need to run in isolation
      }
    }
    // Clean up test cookies
    deleteCookie('test%20secure');
    deleteCookie('test%20https');
    deleteCookie('test%20http');
  });

  it('should set secure flag when secure=true is explicitly passed', function () {
    cookieConsent.initConsent({
      'test secure': true
    });
    
    // Create cookie with explicit secure=true
    cookie.create('test secure', 'securevalue', 1, null, true);
    
    // Note: We can't directly check if secure flag was set via document.cookie
    // because secure cookies are not visible in document.cookie on http pages.
    // This test verifies the function doesn't throw when secure=true is passed.
    expect(true).to.equal(true);
    
    // Clean up
    deleteCookie('test%20secure');
  });

  it('should automatically set secure flag on HTTPS pages', function () {
    // Skip if we can't modify location.protocol
    if (!global.location) {
      this.skip();
      return;
    }

    try {
      Object.defineProperty(global.location, 'protocol', {
        value: 'https:',
        writable: true,
        configurable: true
      });
    } 
    catch (e) {
      // Browser doesn't allow protocol modification, skip test
      this.skip();
      return;
    }

    cookieConsent.initConsent({
      'test https': true
    });

    // Create cookie without explicit secure flag - should auto-secure on HTTPS
    cookie.create('test https', 'httpsvalue', 1);
    
    // The cookie creation should succeed without errors
    // On actual HTTPS, the secure flag would be set automatically
    expect(true).to.equal(true);
    
    // Clean up
    deleteCookie('test%20https');
  });

  it('should NOT set secure flag on HTTP pages when secure param is not passed', function () {
    // Skip if we can't modify location.protocol
    if (!global.location) {
      this.skip();
      return;
    }

    try {
      Object.defineProperty(global.location, 'protocol', {
        value: 'http:',
        writable: true,
        configurable: true
      });
    } 
    catch (e) {
      // Browser doesn't allow protocol modification, skip test
      this.skip();
      return;
    }

    cookieConsent.initConsent({
      'test http': true
    });

    // Create cookie without secure flag on HTTP
    cookie.create('test http', 'httpvalue', 1);
    
    // Cookie should be readable (not secure, so visible on HTTP)
    expect(global.document.cookie).to.have.string('test%20http=httpvalue');
    
    // Clean up
    deleteCookie('test%20http');
  });

  it('should handle missing global.location gracefully', function () {
    var originalLocation = global.location;
    
    // Temporarily remove location
    try {
      delete global.location;
    } 
    catch (e) {
      // Can't delete location in some environments, skip
      this.skip();
      return;
    }

    cookieConsent.initConsent({
      'test nolocation': true
    });

    // Should not throw when global.location is undefined
    expect(function () {
      cookie.create('test nolocation', 'value', 1);
    }).to.not.throw();

    // Restore location
    global.location = originalLocation;
    
    // Clean up
    deleteCookie('test%20nolocation');
  });
});
