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

      if (constructors[constructorName]) {
        resolve(constructors[constructorName]);
        return;
      }
      const tempIframe = document.createElement('iframe');
      tempIframe.src = 'about:blank';
      tempIframe.style.display = 'none';
      tempIframe.style.position = 'absolute';
      tempIframe.style.left = '-9999px';
      tempIframe.height = '0';
      tempIframe.width = '0';
      tempIframe.tabIndex = '-1';
      tempIframe.title = '';
      tempIframe.setAttribute('aria-hidden', 'true');
      tempIframe.setAttribute('role', 'presentation');
      
      document.body.appendChild(tempIframe);
      
      constructors[constructorName] = tempIframe.contentWindow[constructorName];
      document.body.removeChild(tempIframe);
      
      resolve(constructors[constructorName]);
    });
  });
};

module.exports = getOriginalConstructor;