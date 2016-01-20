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
  isEULocale: require('./EU')
};
