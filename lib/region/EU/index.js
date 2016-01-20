/**
 * @module Module for determining if a locale is in the EU.
 *
 * Examples:
 *
 * // Example 1, loading this module directly:
 * var isEULocale = require('bv-ui-core/lib/region/EU');
 * isEULocale('en_US'); // false
 * isEULocale('en_GB'); // true
 *
 * // Example 2, loading the region module:
 * var region = require('bv-ui-core/lib/region');
 * region.isEULocale('en_US'); // false
 * region.isEULocale('en_GB'); // true
 */

var countryCodes = require('./countryCodes');

/**
 * Determine if a given locale is an EU locale based on the country code.
 *
 * @param {String} locale - The locale to be tested. This function accepts
 *   locales of both xx_XX format and country codes on their own, XX.
 *
 * @return {Boolean} Returns true if the locale is an EU locale.
 *   Returns false otherwise.
 */
module.exports = function (locale) {

  // First, we need to fish out a country code. If the locale is of the xx_XX
  // format, we need to toss the language part and keep the country code. If
  // the locale is just a country code already, we can just keep it. Either
  // way, we can just create split along '_' and grab the last one from the
  // resulting list.
  var countryCode = locale.split('_').pop();

  // countryCodes is a map that contains an entry for each valid EU country
  // code, so countryCodes[countryCode] will return either true or undefined.
  // We just need to coerce that into a boolean value and we're good to go.
  var isEULocale = Boolean(countryCodes[countryCode]);

  return isEULocale;
};
