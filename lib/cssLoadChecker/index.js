/**
 * @fileOverview
 * Provides functions for checking if a stylesheet has been loaded previously
 */

// Imports
var global = require('../global');
var body = require('../body');

/**
 * Function to add the test div to the page
 *
 * @param {string} className - The class name used to check if the css file has loaded yet
 *  (does not include the '.' out front, just the name)
 * @return {object} The element that was just created for the purposes of
 *  testing whether the CSS has loaded or not
 */
var _loadTestDiv = function (className) {
  var testDiv;

  testDiv = global.document.createElement('div');
  testDiv.style.height = '0px';
  testDiv.style.width = '0px';
  testDiv.style.border = '0px';
  testDiv.className = className;
  body().appendChild(testDiv);

  return testDiv;
};

/**
 * Function to remove the test div from the page
 *
 * @param {object} testDiv - The element that was created for the purposes of
 *  testing whether the CSS has loaded or not
 */
var _cleanupTestDiv = function (testDiv) {
  testDiv.parentNode.removeChild(testDiv);
};

module.exports = {

  /**
   * Check the test div to see if the styles have loaded
   *
   * @param {string} className - The class name used to check if the css file has loaded yet
   *  (does not include the '.' out front, just the name)
   * @return {boolean} True or false as to whether the style sheet has been loaded.
   */
  isCssLoaded: function (className) {
    var testDiv = _loadTestDiv(className);
    var displayVal;
    var result = false;

    // add support for IE8
    if (!global.getComputedStyle) {
      displayVal = testDiv.currentStyle['display'];
    }
    else {
      var computedStyles = global.getComputedStyle(testDiv);
      displayVal = computedStyles.getPropertyValue('display');
    }

    if (displayVal === 'none') {
      result = true;
    }

    _cleanupTestDiv(testDiv);
    return result;
  }

};
