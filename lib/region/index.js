/**
 * @module Used to determine if a given locale is part of a given region.
 *
 * Currently, the only supported region is EU, because it's the only region
 * we have a need to support. However, this module was designed so that it'd
 * be easy to add new regions, such as APAC, NA, LA, etc.
 *
 * This module is the "generic" module, and can be used to detect any region
 * we support. If your project only needs to detect a specific region, you can
 * require that region's module on its own to reduce file size.
 *
 * Examples:
 *
 * var region = require('bv-ui-core/lib/region');
 * region.hasLocale('europe', 'en_US'); // false
 * region.hasLocale('europe', 'en_GB'); // true
 *
 * region.hasTerritory('europe', 'US'); // false
 * region.hasTerritory('europe', 'GB'); // true
 *
 * Errors will be thrown if an invalid locale or territory code is provided.
 *
 * Example 3, providing invalid input:
 * var region = require('bv-ui-core/lib/region');
 * region.hasLocale('europe', 'banana'); // throws an error
 *
 * // 'fr' is a language code. The correct French territory code is 'FR'.
 * region.hasTerritory('europe', 'fr'); // throws an error.
 */

var regions = {
  europe: require('./europe')
};

module.exports = {

  /**
   * Determine if a given territory is an EU territory.
   *
   * @param {String} region - The region to check for the territory in.
   *
   * @param {String} territory - The locale to be tested. This function accepts
   *   territory codes of the XX format. Three letter territory codes are not
   *   (yet) supported.
   *
   * @return {Boolean} Returns true if the territory is an EU territory.
   *   Returns false otherwise.
   */
  hasTerritory: function (region, territory) {

    if (!regions[region]) {
      throw new Error('Invalid region passed to region.hasTerritory');
    }

    // Simply wrap around the individual region modules.
    return regions[region].hasTerritory(territory);
  },

  /**
   * Determine if a given locale is an EU locale based on the territory code.
   *
   * @param {String} region - The region to check for the territory in.
   *
   * @param {String} locale - The locale to be tested. This function accepts
   *   locales of the xx_XX format only.
   *
   * @return {Boolean} Returns true if the locale is an EU territory.
   *   Returns false otherwise.
   */
  hasLocale: function (region, locale) {

    if (!regions[region]) {
      throw new Error('Invalid region passed to region.hasLocale');
    }

    // Simply wrap around the individual region modules.
    return regions[region].hasLocale(locale);
  },

  /**
   * Return the region of a specified territory.
   *
   * @param {String} territory - The name of the territory.
   *
   * @return {String} Returns the name of the region, or 'unsupported' if the
   *   territory is not part of a supported region.
   */
  lookupTerritory: function (territory) {

    // Loop through the regions looking for the territory.
    var region;
    for (region in regions) {
      if (regions[region].hasTerritory(territory)) {
        return region;
      }
    }

    // If we get here, the territory isn't in any currently supported region.
    return 'unsupported';
  },

  /**
   * Return the region of a specified locale.
   *
   * @param {String} locale - The name of the locale.
   *
   * @return {String} Returns the name of the region, or 'unsupported' if the
   *   locale is not part of a supported region.
   */
  lookupLocale: function (locale) {

    // Loop through the regions looking for the locale.
    var region;
    for (region in regions) {
      if (regions[region].hasLocale(locale)) {
        return region;
      }
    }

    // If we get here, the locale isn't in any currently supported region.
    return 'unsupported';
  }
};
