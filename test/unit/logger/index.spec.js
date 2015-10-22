/**
 * @fileOverview
 * Unit tests for the logger module.
 */

var Logger = require('../../../lib/logger');
var global = require('../../../lib/global');

describe('lib/logger', function () {
  var debugStub,
    logStub,
    infoStub,
    warnStub,
    errorStub;

  before(function () {
    debugStub = sinon.stub(console, 'debug');
    logStub = sinon.stub(console, 'log');
    infoStub = sinon.stub(console, 'info');
    warnStub = sinon.stub(console, 'warn');
    errorStub = sinon.stub(console, 'error');
  });

  afterEach(function () {
    debugStub.reset();
    logStub.reset();
    infoStub.reset();
    warnStub.reset();
    errorStub.reset();

    // reset the log level to the default
    Logger.setLogLevel(Logger.INFO);
  });

  it('works', function () {
    Logger.info('hi');
    expect(infoStub).to.have.been.calledWith('hi');
  });

  it('does not log anything if off', function () {
    Logger.setLogLevel(Logger.OFF);
    Logger.debug('foo');
    expect(debugStub).to.not.have.been.called;
  });

  it('does not log if there is no console', function () {
    var tempConsole = global.console;
    global.console = false;

    Logger.info('foo');
    expect(infoStub).to.not.have.been.called;

    global.console = tempConsole;
  });

  it.skip('defaults to `log` in internet explorer', function () {
    // TODO - fake IE
    Logger.info('foo');
    expect(logStub).to.have.been.calledWith('foo');
  });

  it('logs the result of a passed function', function () {
    var funcToLog = function () {
      return ['foo'];
    };
    Logger.info(funcToLog);
    expect(infoStub).to.have.been.calledWith('foo');
  });

  describe('#setLogLevel', function () {
    it('defaults to 0', function () {
      Logger.setLogLevel();
      expect(Logger.getLogLevel()).to.equal(Logger.LOG);
    });

    it('sets log level', function () {
      Logger.setLogLevel(Logger.OFF)
      expect(Logger.getLogLevel()).to.equal(Logger.OFF);
    });
  });

  describe('#assert', function () {
    it('does not do anything if Logger.OFF', function () {
      Logger.setLogLevel(Logger.OFF);
      expect(function () {
        Logger.assert(false);
      }).to.not.throw(Error, /Assertion failed/);
    });

    it('evaluates a function', function () {
      var funcToAssert = function () {
        // According to #assert, return an array
        return [false];
      };
      expect(function () {
        Logger.assert(funcToAssert);
      }).to.throw(Error, /Assertion failed/);
    });

    it('throws if the assertion failed', function () {
      expect(function () {
        Logger.assert(false)
      }).to.throw(Error, /Assertion failed/);
    });
  })
})