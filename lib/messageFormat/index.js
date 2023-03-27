/**
 *  @fileOverview
 *  messageFormat provides utility functions to which use the INTL API which provides 
 *  language sensitive string comparison, number formatting, and date and time formatting.
 * 
 *  messageFormat can have functions which are used in multiple places
 *
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
 */


/**
 * Generates the country name associated with the given locale
 * @param {string} locale The locale code (e.g., 'en-US')
 * @returns {string} The name of the country associated with the locale, or an empty string if the locale is not supported by Intl.DisplayNames
 */
export function generateCountryFromLocale(locale) {

    //PolyFill for Intl.DisplayNames
    if (typeof Intl === 'undefined' || typeof Intl.DisplayNames === 'undefined') {
      // Load the polyfill if Intl or Intl.DisplayNames is not defined
      const polyfillUrl = 'https://cdn.polyfill.io/v3/polyfill.min.js?features=Intl.DisplayNames';
      const scriptEl = document.createElement('script');
      scriptEl.src = polyfillUrl;
      scriptEl.async = false;
      document.head.appendChild(scriptEl);
    }
    // // Check if Intl.DisplayNames is supported
    // if (!Intl.DisplayNames) {
    //   return '';
    // }
  
    // Split the locale code into language and region components
    const [language, region] = locale.split('_');
  
    // Get the display name for the region (i.e., the country name)
    const regionNames = new Intl.DisplayNames([language], { type: 'region' });
    const countryName = regionNames.of(region);
  
    // Return the country name, or an empty string if the region is not valid
    return countryName || '';
  }