/**
 *  @fileOverview
 *  messageFormat provides utility functions to which use the INTL API which provides 
 *  language sensitive string comparison, number formatting, and date and time formatting.
 * 
 *  messageFormat can have functions which are used in multiple places
 *
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
 */


var global = require('../global');
/**
 * Generates the country name associated with the given locale
 * @param {string} locale The locale code (e.g., 'en_US')
 * @returns {string} The name of the country associated with the locale, or an empty string if the locale is not supported by Intl.DisplayNames
 */
function generateCountryFromLocale (locale) {
  if (!locale || locale.length === 0) {
    return '';
  }
    
  // Split the locale code into language and region components
  try {
    var localeArr = locale.split('_');
    if (localeArr.length < 2) {
      return '';
    }
  // Get the display name for the region (i.e., the country name)
    var regionNames = new global.Intl.DisplayNames(localeArr[0], { type: 'region' });
    var countryName = regionNames.of(localeArr[1]);
  }
  catch (error) {
    return '';
  }
  // Return the country name, or an empty string if the region is not valid
  return countryName 
}

module.exports = {
  generateCountryFromLocale: generateCountryFromLocale
}