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
  
    // Currently commenting this code , remove if polyfill is not required
  
    // // PolyFill for Intl.DisplayNames
    // if (
    //   typeof global.Intl === "undefined" ||
    //   typeof global.Intl.DisplayNames === "undefined"
    // ) {
    //   // Load the polyfill if Intl or Intl.DisplayNames is not defined
    //   const polyfillUrl =
    //     "https://cdn.polyfill.io/v3/polyfill.min.js?features=Intl.DisplayNames";
    //   const scriptEl = document.createElement("script");
    //   scriptEl.src = polyfillUrl;
    //   scriptEl.async = false;
    //   scriptEl.onerror = () => {
    //     console.log("Failed to Load Intl.DisplayNames Polyfill");
    //     polyfillLoaded = false; // set flag to false if the polyfill fails to load
    //   };
    //   document.head.appendChild(scriptEl);
    // }
  
    // Split the locale code into language and region components
  var localeArr = locale.split('_');
  
    // Get the display name for the region (i.e., the country name)
  var regionNames = new global.Intl.DisplayNames(localeArr[0], { type: 'region' });
  var countryName = regionNames.of(localeArr[1]);
    // Return the country name, or an empty string if the region is not valid
  return countryName || '';
}

module.exports = {
  generateCountryFromLocale: generateCountryFromLocale
}