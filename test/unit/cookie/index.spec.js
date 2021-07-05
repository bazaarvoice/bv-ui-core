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
