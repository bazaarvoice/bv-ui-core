/**
 * @fileOverview
 * Unit tests for the evented module.
 *
 * The tests in this file are minimal because the module is covered by the tests
 * in the original asEvented repo (https://github.com/mkuklis/asEvented). With
 * that in mind, this file just aims to test that we expose the interface we
 * promise to expose.
 */

// Imports.
var evented = require('../../../lib/evented');

describe('lib/import', function () {

  it('exports a function that creates an event emitter', function () {
    function M () {}

    evented.call(M.prototype);
    var m = new M();

    expect(m.on).to.be.a('function');
    expect(m.off).to.be.a('function');
    expect(m.trigger).to.be.a('function');
    expect(m.one).to.be.a('function');
    expect(m.once).to.be.a('function');
  });

});
