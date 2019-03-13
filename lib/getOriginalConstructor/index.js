/**
 *  @fileOverview
 *  This file exposes a utility function to get a reset version of a primitive
 *  constructor, in the event that a site has overridden or polyfilled
 *  prototype methods in their own primitives, or used a utility like
 *  Prototype.js, which does that on its own.
 */

var waitForBody = require('../waitForBody');

var constructors = {};
// eslint-disable-next-line no-useless-escape
var constructorNameRegExp = /function\s+([^\(\s]+)/;
var iframe;

var getOriginalConstructor = function getOriginalConstructor (constructor) {
  return new Promise(function (resolve) {
    waitForBody(function () {
      var constructorName = constructor.name;
      // IE11 doesn't have a constructor.name property, so just in case any other
      // browsers also don't, use a simple regex to pull the constructor's name
      // out of the .toString()'d function declaration, e.g. "function Array()"
      if (!constructorName) {
        constructorName = constructorNameRegExp.exec(constructor.toString())[1];
      }

      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.src = 'about:blank';
        iframe.style.display = 'none';
        iframe.height = '0';
        iframe.width = '0';
        iframe.tabIndex = '-1';
        iframe.title = 'empty';
        iframe.className = 'hidden';
        document.body.appendChild(iframe);
      }

      if (!constructors[constructorName]) {
        constructors[constructorName] = iframe.contentWindow[constructorName];
      }

      resolve(constructors[constructorName]);
    });
  });
};

module.exports = getOriginalConstructor;
