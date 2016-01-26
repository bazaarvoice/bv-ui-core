/**
 * @module Module for determining if a locale is in the EU.
 *
 * Examples:
 *
 * // Example 1, loading this module directly:
 * var europe = require('bv-ui-core/lib/region/europe');
 * europe.hasLocale('en_US'); // false
 * europe.hasLocale('en_GB'); // true
 *
 * europe.hasTerritory('US'); // false
 * europe.hasTerritory('GB'); // true
 *
 * // Example 2, loading the region module:
 * var region = require('bv-ui-core/lib/region');
 * region.hasLocale('europe', 'en_US'); // false
 * region.hasLocale('europe', 'en_GB'); // true
 *
 * region.hasTerritory('europe', 'US'); // false
 * region.hasTerritory('europe', 'GB'); // true
 */

// territories is a map that contains an entry for each valid EU country
// code, so territories[territory] will return either true or undefined.
// We just need to coerce that into a boolean value and we're good to go.
var territories = require('./territories');

// Some constant patterns for valid values.
var VALID_TERRITORY = /^[A-Z][A-Z]$/;
var VALID_LOCALE = /^[a-z][a-z][\_\-][A-Z][A-Z]$/;

module.exports = {

  /**
   * Determine if a given territory is an EU territory.
   *
   * @param {String} territory - The locale to be tested. This function accepts
   *   territory codes of the XX format. Three letter territory codes are not
   *   (yet) supported.
   *
   * @return {Boolean} Returns true if the territory is an EU territory.
   *   Returns false otherwise.
   */
  hasTerritory: function (territory) {

    if (!VALID_TERRITORY.test(territory)) {
      throw new Error('Invalid territory code passed to hasTerritory.');
    }

    return !!territories[territory];
  },

  /**
   * Determine if a given locale is an EU locale based on the territory code.
   *
   * @param {String} locale - The locale to be tested. This function accepts
   *   locales of the xx_XX format only.
   *
   * @return {Boolean} Returns true if the locale is an EU territory.
   *   Returns false otherwise.
   */
  hasLocale: function (locale) {

    if (!VALID_LOCALE.test(locale)) {
      throw new Error('Invalid locale code passed to hasLocale.');
    }

    var territory = locale.split(/[\_\-]/).pop();

    return !!territories[territory];
  },

  /**
   * Return a list of country codes in this region.
   *
   * @return {Array} - A list of country codes in the european region.
   */
  listTerritories: function () {
    return Object.keys(territories);
  }
};
