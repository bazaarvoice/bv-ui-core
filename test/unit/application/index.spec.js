/**
 * @fileOverview
 * Unit tests for the application module.
 */

// Imports.
var Application = require('../../../lib/application');
var global = require('../../../lib/global');

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

  describe('ready method', function () {

    it('queues calls to ready', function () {
      var fn = sandbox.spy();

      expect(application._readyQueue.length).to.equal(0);
      application.ready(fn);
      expect(application._readyQueue.length).to.equal(1);
    });

    it('original ready method always gets replaced', function () {
      application.originalReady = application.ready;
      application.processReady();

      expect(application.originalRender).to.not.equal(application.ready);
    });

    it('automatically processes callbacks after processReady is called', function () {
      var fn = sandbox.spy();

      application.ready(fn);
      sinon.assert.notCalled(fn);

      application.processReady();
      sinon.assert.calledOnce(fn);

      application.ready(fn);
      sinon.assert.calledTwice(fn);
    });

    it('returns a Promise when Promises are available', function () {
      if (typeof global.Promise === 'function') {
        var returnVal = application.ready();
        expect(returnVal).to.not.be.a('number');
        expect(returnVal.then).to.be.a('function');
      }
      else {
        // Auto-pass in this environment
        expect(true).to.equal(true);
      }
    });

    it('automatically processes Promise chain callbacks after processReady is called', function () {
      if (typeof global.Promise === 'function') {
        var fn = sandbox.spy();

        application.ready().then(fn);
        sinon.assert.notCalled(fn);

        application.processReady();

        /**
         * Apparently, Promises get processed asynchronously, even when
         * they're not asynchronous processes, e.g., the following code
         * fails its assertions:
         *
         * var fn = sandbox.spy();
         * var promise = Promise.resolve();
         * promise.then(fn);
         * sinon.assert.calledOnce(fn);
         *
         * Because of this, we have to wrap our below assertions in a
         * double layer of setTimeout(0) statements, to defer to the
         * next event loop before we check the status of our spies.
         */
        setTimeout(function () {
          sinon.assert.calledOnce(fn);

          application.ready().then(fn);

          setTimeout(function () {
            sinon.assert.calledTwice(fn);
          }, 0);
        }, 0);
      }
      else {
        // Auto-pass in this environment
        expect(true).to.equal(true);
      }
    });

    it('returns length of queue when Promises are unavailable', function () {
      if (typeof global.Promise === 'function') {
        // Auto-pass in this environment
        expect(true).to.equal(true);
      }
      else {
        var returnVal;
        // Invoke .ready() and make sure it returns undefined
        returnVal = application.ready();
        expect(returnVal).to.equal(0);
        returnVal = application.ready(sandbox.spy());
        expect(returnVal).to.equal(1);
      }
    });

  });

  describe('processReady method', function () {

    it('processes the queue sync', function () {
      var fn = sandbox.spy();

      application.ready(fn);
      application.processReady();

      sinon.assert.calledOnce(fn);

      application.ready(fn);

      sinon.assert.calledTwice(fn);
    });

    it('injects its callbacks with its own instance when invoked with no error', function () {
      if (typeof global.Promise === 'function') {
        // Auto-pass in this environment
        expect(true).to.equal(true);
      }
      else {
        var fn = sandbox.spy();

        application.ready(fn);
        application.processReady();

        sinon.assert.calledWith(fn, [null, application]);
      }
    });

    it('injects its callbacks with an error when invoked with an error', function () {
      if (typeof global.Promise === 'function') {
        // Auto-pass in this environment
        expect(true).to.equal(true);
      }
      else {
        var error = new Error('Test Error');
        var fn = sandbox.spy();

        application.ready(fn);
        application.processReady(error);

        sinon.assert.calledWith(fn, [error, application]);
      }
    });

    it('resolves its promise with its own instance when invoked with no error', function (done) {
      if (typeof global.Promise === 'function') {
        application.ready()
          .then(function (app) {
            expect(application).to.equal(app);
          })
          .catch(function (err) {
            expect(false).to.equal(true);
          })
          .then(function () {
            done();
          });

        application.processReady();
      }
      else {
        // Auto-pass in this environment
        expect(true).to.equal(true);
      }
    });

    it('rejects its promise with an error when invoked with an error', function (done) {
      if (typeof global.Promise === 'function') {
        var error = new Error('Test Error');

        application.ready()
          .then(function (app) {
            expect(false).to.equal(true);
          })
          .catch(function (err) {
            expect(error).to.equal(err);
          })
          .then(function () {
            done();
          });

        application.processReady(error);
      }
      else {
        // Auto-pass in this environment
        expect(true).to.equal(true);
      }
    });

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
