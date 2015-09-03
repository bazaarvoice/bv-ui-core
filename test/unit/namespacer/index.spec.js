/**
 * @fileOverview
 * Tests for the namespacer module.
 */

var global = require('../../../lib/global');
var namespacer = require('../../../lib/namespacer');

describe('lib/namespacer', function () {
  var nameA = 'nameA';
  var nameB = 'nameB';

  function hasNamespaceProperties (name, obj) {
    expect(obj.name).to.equal(name);
    expect(obj.registerProperty).to.be.a('function');
  }

  beforeEach(function () {
    global[nameA] = undefined;
    global[nameB] = undefined;
  });

  it('creates a namespace', function () {
    var namespace = namespacer.namespace(nameA);
    expect(namespace).to.be.an('object');
    expect(global[nameA]).to.equal(namespace);
    hasNamespaceProperties(nameA, namespace);
  });

  it('adds the namespace to the global object', function () {
    var namespace = namespacer.namespace(nameA);
    expect(global[nameA]).to.equal(namespace);
  });

  it('returns the same namespace instance on second invocation', function () {
    var namespace1 = namespacer.namespace(nameA);
    var namespace2 = namespacer.namespace(nameA);
    expect(namespace1).to.equal(namespace2);
  });

  it('creates distinct namespace instances', function () {
    var namespaceA = namespacer.namespace(nameA);
    var namespaceB = namespacer.namespace(nameB);
    expect(namespaceA).to.not.equal(namespaceB);
  });

  it('throws when non-object property is already assigned to global', function () {
    expect(function () {
      global[nameA] = false;
      namespacer.namespace(nameA);
    }).to.throw(Error);

    expect(function () {
      global[nameA] = null;
      namespacer.namespace(nameA);
    }).to.throw(Error);

    expect(function () {
      global[nameA] = '';
      namespacer.namespace(nameA);
    }).to.throw(Error);
  });

  it('decorates existing object property assigned to global', function () {
    global[nameA] = {};
    namespacer.namespace(nameA);
    hasNamespaceProperties(nameA, global[nameA]);
  });

  describe('namespace', function () {
    var propA = 'propA';
    var propB = 'propB';
    var valueA = {};
    var valueB = {};
    var namespace;

    beforeEach(function () {
      namespace = namespacer.namespace(nameA);
    });

    describe('registerProperty', function () {

      it('registers properties', function () {
        namespace.registerProperty(propA, valueA);
        namespace.registerProperty(propB, valueB);

        expect(namespace[propA]).to.equal(valueA);
        expect(namespace[propB]).to.equal(valueB);
      });

      it('throws on reregistering a property', function () {
        expect(function () {
          namespace.registerProperty(propA, valueA);
          namespace.registerProperty(propA, valueA);
        }).to.throw(Error);
      });

    });
  });
});
