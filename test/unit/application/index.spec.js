/**
 * @fileOverview
 * Unit tests for the application module.
 */

// Imports.
var Application = require('../../../lib/application');

describe('lib/application', function () {

  var config;
  var application;
  var sandbox;

  beforeEach(function () {
    config = { foo: 'bar' };
    application = new Application(config);
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('render method', function () {

    it('queues calls to render', function () {
      expect(application._renderQueue.length).to.equal(0);
      application.render(config);
      expect(application._renderQueue.length).to.equal(1);
    });

    it('original render method always gets replaced', function () {
      var fn = sandbox.spy();

      application.originalRender = application.render;
      application.processQueue(fn);

      // Even calling application's original definition of render
      // should call the new function.
      application.originalRender();
      application.originalRender();
      application.originalRender();

      sinon.assert.calledThrice(fn);
    });

  });

  describe('processQueue method', function () {

    it('processes the queue async', function (done) {
      var fn = sandbox.spy();

      application.render(config);
      application.render(config);
      application.processQueue(fn);

      sinon.assert.notCalled(fn);

      setTimeout(function () {
        sinon.assert.calledTwice(fn);
        done();
      }, 100);
    });

    it('redefines the render method', function (done) {
      var fn = function () {};

      application.processQueue(fn);

      setTimeout(function () {
        expect(application.render).to.equal(fn);
        done();
      }, 100);
    });

    it('throws if handler is not provided', function () {
      expect(function () {
        application.processQueue();
      }).to.throw(Error);
    });

  });

  describe('configure method', function () {

    it('queues calls to configure', function () {
      expect(application._configQueue.length).to.equal(0);
      application.configure(config);
      expect(application._configQueue.length).to.equal(1);
    });

    it('original configure method always gets replaced', function () {
      var fn = sandbox.spy();

      application.originalConfigure = application.configure;
      application.processConfig(fn);

      // Even calling application's original definition of configure
      // should call the new function.
      application.originalConfigure();
      application.originalConfigure();
      application.originalConfigure();

      sinon.assert.calledThrice(fn);
    });

  });

  describe('processConfig method', function () {

    it('processes the queue', function () {
      var fn = sandbox.spy();

      application.configure(config);
      application.configure(config);
      application.processConfig(fn);

      sinon.assert.calledTwice(fn);
    });

    it('redefines the configure method', function () {
      var fn = function () {};

      application.processConfig(fn);
      expect(application.configure).to.equal(fn);
    });

    it('throws if handler is not provided', function () {
      expect(function () {
        application.processConfig();
      }).to.throw(Error);
    });

  });
});
