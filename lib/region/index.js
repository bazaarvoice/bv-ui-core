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
 * region.isEULocale('en_US'); // false
 * region.isEULocale('en_GB'); // true
 */

var regions = {
  europe: require('./europe')
};

module.exports = {

  /**
   * Determine if a given locale is an EU locale based on the country code.
   *
   * @param {String} locale - The locale to be tested. This function accepts
   *   locales of both xx_XX format and country codes on their own, XX.
   *
   * @return {Boolean} Returns true if the locale is an EU locale.
   *   Returns false otherwise.
   */
  has: function (locale, region) {

    // If the region doesn't exist, it certainly doesn't contain the locale.
    if (!region || !regions[region]) {
      return false;
    }

    // Simply wrap around the individual region modules.
    return regions[region].has(locale);
  },

  lookup: function (locale) {

    // Loop through the regions looking for the locale.
    var region;
    for (region in regions) {
      if (regions[region].has(locale)) {
        return region;
      }
    }

    // If we get here, the locale isn't in any currently supported locale.
    return 'unsupported region';
  }
};
