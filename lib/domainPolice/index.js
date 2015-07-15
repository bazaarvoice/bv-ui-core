/**
 * @fileOverview
 * The DomainPolice module is used to provide validation that content is only
 * being loaded on authorized domains.
 */

// Dependencies
var parseUri = require('../parseUri');

// Variables used in our exposed methods to support memoization
var allowedDomainCache = {};
var cookieEnabledCache = {};

/**
 * Returns true if the hostname is an exact match for a specific domain or a
 * suffix match for a wildcard domain (domain starts with a '.').
 *
 * @param  {String} domain Domain to check.
 * @param  {String} host   Domain to check against.
 * @return {Boolean}
 */
function domainMatches (domain, host) {
  if (domain.charAt(0) === '.' && host) {
    // domainMatches('.domain.com', 'sub.domain.com') and
    // domainMatches('.sub.domain.com', 'sub.domain.com') are both true.
    var index = ('.' + host).lastIndexOf(domain);
    return index >= 0 && index === (1 + host.length - domain.length);
  }
  else {
    return host === domain;
  }
}

/**
 * Returns the matching hostname if the hostname of the specified url matches
 * one of the specified domains.
 *
 * @param  {String} url The URL to check (including protocol, e.g. "http://example.com")
 * @param  {Array} domains The set of domain objects to check the URL against
 * @return {String} The URL that matched, or `undefined` if none found.
 */
function allowedDomain (url, domains) {
  var host = parseUri(url).host;
  var domain;

  if ( allowedDomainCache.hasOwnProperty(host) ) {
    return allowedDomainCache[host];
  }

  for (var i = 0; i < domains.length; i++) {
    if ( domainMatches(domains[i].domainAddress, host) ) {
      domain = domains[i].domainAddress;

      // Special case: If the domain is a valid IPv4 address,
      // remove the leading period. The return value here is used
      // when setting a cookie, and IPv4 addresses with a prefixed
      // period do not work for cookie setting, as they do for domains.
      if ( domain.match(/^(\.\d+){4}$/) ) {
        domain = domain.substr(1);
      }

      // Cache and return the domain
      allowedDomainCache[host] = domain;
      return domain;
    }
  }

  // No match found, explicitly set to undefined and return
  allowedDomainCache[host] = undefined;
  return undefined;
}

/**
 * Returns true if third party cookies are enabled for the current domain.
 *
 * @param  {String} url The URL to check (including protocol, e.g. "http://example.com")
 * @param  {Array} domains The set of domain objects to check for third party cookies
 * @return {Boolean}
 */
function thirdPartyCookieEnabled (url, domains) {
  var host = parseUri(url).host;

  if ( cookieEnabledCache.hasOwnProperty(host) ) {
    return cookieEnabledCache[host];
  }

  for (var i = 0; i < domains.length; i++) {
    var matches = domainMatches(domains[i].domainAddress, host);
    if (matches && domains[i].thirdPartyCookieEnabled) {
      cookieEnabledCache[host] = true;
      return true;
    }
  }

  // Not found, assuming not allowed
  cookieEnabledCache[host] = false;
  return false;
}

module.exports = {
  allowedDomain : allowedDomain,
  thirdPartyCookieEnabled : thirdPartyCookieEnabled
};
