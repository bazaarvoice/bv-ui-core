/**
 * @fileOverview
 * Provides a function to retrieve the body of the current document.
 *
 * https://dojotoolkit.org/reference-guide/1.7/dojo/body.html
 */

// Imports
var global = require('../global');

var cachedBody;

module.exports = function () {
  // In some browsers (<= IE8) it is possible to have your code execute before document.body has been populated.
  // For that reason, we use a fallback of `getElementsByTagName` -- and because it is possible to have multiple
  // body elements in one page, we specify the first element in the resulting array.
  cachedBody = cachedBody || global.document.body || global.document.getElementsByTagName('body')[0];
  return cachedBody;
};
