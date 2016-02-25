/**
 * @fileOverview
 * Unit tests for the cssLoadChecker module.
 */

// Imports.
var global = require('../../../lib/global');
var cssLoadChecker = require('../../../lib/cssLoadChecker');

/**
 * Helper function to add a test style sheet to the page
 *
 * @param {string} className - The class name used to check if the css file has loaded yet.
 * @return {object} The style element that was added to the page.
 */
var addCss = function (className) {
  var cssStyles = global.document.createElement('style');
  cssStyles.type = 'text/css';
  cssStyles.innerHTML = '.' + className + ' { display: none; }';
  global.document.getElementsByTagName('head')[0].appendChild(cssStyles);
  return cssStyles;
};

/**
 * Helper function to remove a test style sheet from the page
 *
 * @param {object} cssStyles - the style element that was added to the page.
 */
var removeCss = function (cssStyles) {
  if (cssStyles) {
    cssStyles.parentNode.removeChild(cssStyles);
  }
};


describe('lib/cssLoadChecker', function () {

  var sandbox;
  var cssStyles;
  var className = 'bv-verify-css-loaded';

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
    removeCss(cssStyles);
    cssStyles = undefined;
  });


  describe('isCssLoaded', function () {

    it('CSS is not loaded', function () {
      var test = cssLoadChecker.isCssLoaded(className);
      expect(test).to.equal(false);
    });

    it('CSS is loaded', function () {
      cssStyles = addCss(className);
      var test = cssLoadChecker.isCssLoaded(className);
      expect(test).to.equal(true);
    });

    it('After checking for CSS, test div should be removed', function () {
      cssLoadChecker.isCssLoaded(className);

      var allTestDivs = global.document.getElementsByClassName(className);
      expect(allTestDivs.length).to.equal(0);
    });

  });

});
