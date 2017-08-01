/**
 *  @fileOverview
 *  This file exposes a utility function to get a reset version of a primitive
 *  constructor, in the event that a site has overridden or polyfilled
 *  prototype methods in their own primitives, or used a utility like
 *  Prototype.js, which does that on its own.
 */

var constructors = {};

var getOriginalConstructor = function getOriginalConstructor (constructor) {
  if (!constructors[constructor.name]) {
    var iframe = document.createElement('iframe');
    iframe.src = 'about:blank';
    document.head.appendChild(iframe);
    constructors[constructor.name] = iframe.contentWindow[constructor.name];
    document.head.removeChild(iframe);
  } return constructors[constructor.name];
};

module.exports = getOriginalConstructor;
