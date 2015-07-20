/**
 * @fileOverview
 * The DomainPolice module is used to provide validation that content is only
 * being loaded on authorized domains.
 */

// Dependencies
var parseUri = require('../parseUri');

// Variables used in our exposed methods to support memoization

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
 * Returns the matching domain object if the hostname of the specified URL
 * matches one of the specified domains.
 *
 * @param  {String} url The URL to check (including protocol, e.g. "http://example.com")
 * @param  {Array}  domains The set of domain objects to check the URL against
 * @return {Object} The matching domain object from the array of provided domains
 */
function allowedDomain (url, domains) {
  var host = parseUri(url).host;
  var matchedDomain;

  for (var i = 0; i < domains.length; i++) {
    if (domainMatches(domains[i].domain, host)) {
      matchedDomain = domains[i];

      return matchedDomain;
    }
  }

  // No match found, explicitly returning undefined
  return undefined;
}

/**
 * Returns an object that represents a found domain, including the ability to get various attributes off of the associated object from the domains array.
 *
 * @param  {String} url The URL to check (including protocol, e.g. "http://example.com")
 * @param  {Array}  domains The set of domain objects to check the URL against
 * @return {Object} An object representing the state of the matched domain
 */
function domainPolice(host, domains) {
  var domainState = {};
  var domain = {
    isValid : false,
    get : function (key) {
      return domainState[key];
    }
  };

  var domainObject = allowedDomain(host, domains);

  // If we have a matching domain
  if (domainObject) {
    domain.isValid = true;
    // Manually copying keys, because I can't safely use Object.assign
    // or the npm object-assign module, or even lodash.assign/lodash.extend,
    // as they're assuming ES5 environments.
    // TODO: Once we drop IE8, simplify.
    for (var key in domainObject) {
      if (domainObject.hasOwnProperty(key)) {
        domainState[key] = domainObject[key];
      }
    }

    // Special case: If the domain is a valid IPv4 address,
    // remove the leading period.
    // The return value here should be used when setting a cookie, and IPv4
    // addresses with a prefixed period do not work for cookie setting like
    // they do for domains.
    if (domainState.domain.match(/^(\.\d+){4}$/)) {
      domainState.domain = domainState.domain.substr(1);
    }
  }

  return domain;
}

module.exports = domainPolice;
