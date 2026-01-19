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
 * @param {String} [sameSite='Lax'] The SameSite attribute ('Strict', 'Lax', or 'None'). Defaults to 'Lax'.
 */
function createCookie (name, value, days, domain, secure, sameSite = 'Lax') {
  var date = new Date();

  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  var expires = days ? ';expires=' + date.toGMTString() : '';

  // Determine if the cookie should be secure.
  // Force the Secure flag if the page is loaded over HTTPS, OR if the explicit `secure` argument is true.
  // This ensures that all cookies (including BVBRANDID) set by this library are secure in production environments.
  var isSecure = secure || (global.location && global.location.protocol === 'https:');

  // SameSite=None requires the Secure flag, so we fallback to 'Lax' if not secure.
  var sameSiteValue = (sameSite === 'None' && !isSecure) ? 'Lax' : sameSite;

  var c = encodeURIComponent(name) + '=' +
    encodeURIComponent(value) +
    expires +
    ';path=/' +
    (domain ? (';domain=' + domain) : '') +
    (isSecure ? ';secure' : '') +
    ';SameSite=' + sameSiteValue;

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
function removeCookie (name, domain) {
  delete store[name];
  if (domain) {
    createCookie(name, '', -1, domain);
  }
  else {
    createCookie(name, '', -1);
  }
}

module.exports = {
  create: function (name, value, days, domain, secure, sameSite) {
    store[name] = value;
    var consentPresent = cookieConsent.getConsent(name);
    if (consentPresent) {
      createCookie(name, value, days, domain, secure, sameSite);
    }
    cookieConsent.subscribe(name, 'add', function (consent) {
      if (consent) {
        createCookie(name, value, days, domain, secure, sameSite);
      }
      else {
        removeCookie(name, domain);
      }
    });

    cookieConsent.subscribe(name, 'enable', function () {
      createCookie(name, value, days, domain, secure, sameSite);
    });

    cookieConsent.subscribe(name, 'disable', function () {
      removeCookie(name, domain);
    });
  },
  read: readCookie,
  remove: removeCookie
};
