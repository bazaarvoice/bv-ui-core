/**
 * @fileOverview
 * Unit tests for the getOriginalConstructor module.
 */

// Imports.
var getOriginalConstructor = require('../../../lib/getOriginalConstructor');

describe('lib/getOriginalConstructor', function () {
  var originalPush = Array.prototype.push;
  var push = function push () {
    originalPush.apply(this, arguments);
  }

  Array.prototype.push = push;

  var originalArray = getOriginalConstructor(Array);

  it('Should return an unaltered constructor', function () {
    // Verify that the original push function matches '[native code]'
    expect(!!originalPush.toString().match(/\[native code]/)).to.equal(true);
    // Verify that the overridden push function doesn't match '[native code]'
    expect(!!Array.prototype.push.toString().match(/\[native code]/)).to.equal(false);

    // Verify that the getOriginalConstructor function returns a reset
    // constructor and that its prototype push function matches '[native code]'
    expect(!!originalArray.prototype.push.toString().match(/\[native code]/)).to.equal(true);
  });

  it('Should cache the returned constructor for future lookups', function () {
    expect(getOriginalConstructor(Array)).to.equal(originalArray);
  });

  it('Should return the definition for constructor.name when constructor.name exists', function () {
    var constructor = function Array () {};

    Object.defineProperty(constructor, 'name', {
      value: 'Array'
    })

    // We should pull the Array constructor, with prototype, if this is working properly
    expect(getOriginalConstructor(constructor)).to.have.property('prototype');
  });

  it('Should return the definition for the function name where constructor.name doesn\'t exist', function () {
    var constructor = function Array () {};

    // We should pull the Array constructor, with prototype, if this is working properly
    expect(getOriginalConstructor(constructor)).to.have.property('prototype');
  });
});
