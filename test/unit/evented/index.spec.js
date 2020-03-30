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

  it('invokes an errorHandler function correctly', function () {
    function M () {}

    evented.call(M.prototype);
    var m = new M();

    // Ensure that errors escaping from listeners are caught
    var error = new Error('test error 1');
    m.on('test_event', function () {
      throw error;
    });
    m.trigger('test_event'); // should NOT throw

    // Ensure that errors are provided to custom error handler
    error = new Error('test error 2');
    var spy = sinon.spy();
    m.setErrorHandler(spy);
    m.trigger('test_event');
    expect(spy).to.have.been.calledWith(error, sinon.match.has('event', 'test_event'));

    // Ensure that errors can be rethrown from custom error handler
    error = new Error('test error 3');
    m.setErrorHandler(function (theError) {
      throw theError;
    });
    expect(function () {
      m.trigger('test_event');
    }).to.throw(error);
  })

});
