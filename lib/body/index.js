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
  cachedBody = cachedBody || global.document.body || global.document.getElementsByTagName('body')[0];
  return cachedBody;
};
