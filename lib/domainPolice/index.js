/**
 * @fileOverview
 * The DomainPolice module is used to provide validation that content is only
 * being loaded on authorized domains.
 */

/**
 * Returns true if the hostname is an exact match for a specific domain or a
 * suffix match for a wildcard domain (domain starts with a '.').
 *
 * @param  {String} domain Domain to check.
 * @param  {String} hostname Hostname to check against.
 * @return {Boolean}
 */
function domainMatches (domain, hostname) {
  if (domain.charAt(0) === '.' && hostname) {
    // domainMatches('.domain.com', 'sub.domain.com') and
    // domainMatches('.sub.domain.com', 'sub.domain.com') are both true.
    var index = ('.' + hostname).lastIndexOf(domain);
    return index >= 0 && index === (1 + hostname.length - domain.length);
  }

  return hostname === domain || hostname === ('www.' + domain);
}

/**
 * Returns the matching domain object if the hostname of the specified URL
 * matches one of the specified domains.
 *
 * @param  {Array}  domains The set of domain objects to check the URL against
 * @param  {String} hostname The hostname to check
 * @return {Object} The matching domain object from the array of provided domains
 */
function allowedDomain (domains, hostname) {
  var matchedDomain;

  for (var i = 0; i < domains.length; i++) {
    if (domainMatches(domains[i].domain, hostname)) {
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
 * @param  {Array}  domains The set of domain objects to check the URL against
 * @param  {String} hostname The hostname to be checked against. Preferably sourced by using window.location.hostname.
 * @return {Object} An object representing the state of the matched domain
 */
function domainPolice (domains, hostname) {
  var domainState = {};
  var domain = {
    isValid: false,
    get: function (key) {
      return domainState[key];
    }
  };

  var domainObject = allowedDomain(domains, hostname);

  // If we have a matching domain
  if (domainObject) {
    domain.isValid = true;

    domainState = Object.assign({}, domainState, domainObject);

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
