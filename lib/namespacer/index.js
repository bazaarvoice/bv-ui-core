/**
 * @fileOverview
 * A namespace generator.
 *
 * @module
 */

var global = require('../global');

// --------------------------------------------------------------------------
// Namespace class definition.
// --------------------------------------------------------------------------

/**
 * @class
 * A namespace.
 *
 * @param name The name of this Namespace instance. It should be the same as the
 *   name of the global property to which this namespace is assigned.
 */
function Namespace (name) {
  this.name = name;
}

/**
 * Register a property in the namespace, such as an application instance.
 *
 * Attempting to register the same property twice is almost always an error, and
 * thus results in an exception.
 *
 * @param {String} name The property name.
 * @param {Mixed} value The property value.
 * @return {Namespace} The namespace instance. Useful for chaining.
 */
Namespace.prototype.registerProperty = function (name, value) {
  if (this.hasOwnProperty(name)) {
    throw new Error(
      'Cannot register ' + name +
      ' because a property with that name already exists on window.' +
      this.name
    );
  }

  this[name] = value;
  return this;
};

// --------------------------------------------------------------------------
// Exported interface.
// --------------------------------------------------------------------------

module.exports = {
  /**
   * Obtain a namespace object, creating one if necessary.
   *
   * The namespace will be assigned to the global object as a property
   * with the provided name. i.e. namespacer.namespace('foo') creates or returns
   * a namespace at global[foo].
   *
   * @param {String} name The namespace name.
   * @return {Mixed} The namespace.
   */
  namespace: function (name) {
    // If there is no global property yet assigned for this namespace then
    // create one.
    if (global[name] === undefined) {
      global[name] = new Namespace(name);
    }
    // If an object already exists for this global property, check to see
    // whether or not it is a Namespace instance or some other form of object.
    else if (typeof global[name] === 'object') {
      // If the existing object is not a Namespace instance, then provide it
      // with the necessary decorations and capabilies of a Namespace instance.
      //
      // Other code may have a reference to the object, so we can't do anything
      // more drastic such as replacing it.
      if (!(global[name] instanceof Namespace)) {
        Namespace.call(global[name], name);
        for (var prop in Namespace.prototype) {
          global[name][prop] = Namespace.prototype[prop];
        }
      }
    }
    // If something other than undefined or an object is assigned to this global
    // property then assume that other code is using it for another purpose, so
    // throw.
    else {
      throw new Error(
        'Namespace ' + name + ' cannot be created.' +
        ' A non-object variable is already assigned to window.' + name
      );
    }

    return global[name];
  }
};
