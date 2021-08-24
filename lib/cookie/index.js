/**
 * @fileOverview
 * Provides cookie utilities.
 */

// Imports.
var global = require('../global');
var cookieConsent = require('../cookieConsent');
// Store to hold cookie values
var store = {};
/**
 * Create a cookie.
 *
 * @param {String} name The cookie name.
 * @param {String} value The cookie value.
 * @param {Number} days The cookie lifespan in days.
 * @param {String} [domain] The domain for the cookie.
 * @param {Boolean} [secure] Whether this is a secure cookie.
 */
function createCookie (name, value, days, domain, secure) {
  var date = new Date();

  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  var expires = days ? ';expires=' + date.toGMTString() : '';

  var c = encodeURIComponent(name) + '=' +
    encodeURIComponent(value) +
    expires +
    ';path=/' +
    (domain ? (';domain=' + domain) : '') +
    (secure ? (';secure') : '');

  global.document.cookie = c;
}
/**
 * Obtain the value of a cookie.
 *
 * @param {String} name The cookie name.
 * @return {String} The cookie value or null if no such cookie.
 */
function readCookie (name) {
  var nameEQ = encodeURIComponent(name) + '=';
  var ca = global.document.cookie.split(';');
  var i;

  for (i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }

    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }

  return null;
}
/**
 * Remove a cookie.
 *
 * @param {String} name The cookie name.
 */
function removeCookie (name) {
  delete store[name];
  createCookie(name, '', -1);
}

module.exports = {
  create: function (name, value, days, domain, secure) {
    store[name] = value;
    if (cookieConsent.getConsentDisabled()) {
      createCookie(name, value, days, domain, secure);
    }
    else {
      var consentPresent = cookieConsent.getConsent(name);
      if (consentPresent) {
        createCookie(name, value, days, domain, secure);
      }

      cookieConsent.subscribe(name, 'enable', function () {
        createCookie(name, value, days, domain, secure);
      });

      cookieConsent.subscribe(name, 'disable', function () {
        removeCookie(name);
      });
    }
  },
  read: readCookie,
  remove: removeCookie
};
