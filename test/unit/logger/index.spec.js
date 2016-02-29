/**
 * @fileOverview
 * Unit tests for the logger module.
 */

var Logger = require('../../../lib/logger');
var global = require('../../../lib/global');

describe('lib/logger', function () {
  var sandbox;
  var debugStub;
  var logStub;
  var infoStub;
  var groupStub;
  var groupEndStub;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    debugStub = sandbox.stub(global.console, 'debug');
    logStub = sandbox.stub(global.console, 'log');
    infoStub = sandbox.stub(global.console, 'info');
    groupStub = sandbox.stub(global.console, 'group');
    groupEndStub = sandbox.stub(global.console, 'groupEnd');
  });

  afterEach(function () {
    // reset the log level to the default
    Logger.setLogLevel(Logger.INFO);
    sandbox.restore();
  });

  it('works', function () {
    Logger.info('Hello');
    sinon.assert.notCalled(infoStub);
    Logger.setLogLevel(Logger.INFO, true);
    Logger.info('World');
    sinon.assert.calledWith(infoStub, 'World');
  });

  it('does not log anything if off', function () {
    Logger.setLogLevel(Logger.OFF);
    Logger.debug('foo');
    sinon.assert.notCalled(debugStub);
  });

  it('does not log if there is no console', function () {
    var tempConsole = global.console;
    global.console = false;

    Logger.info('foo');
    global.console = tempConsole;

    sinon.assert.notCalled(infoStub);
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

  describe('#group', function () {
    it('calls console.group if maxLevel is < the current log level', function () {
      Logger.group(Logger.INFO);
      expect(groupStub).to.have.been.called;
    });

    it('does not call console.group if maxLevel is < the current log level', function () {
      Logger.group(Logger.DEBUG);
      expect(groupStub).to.not.have.been.called;
    });

    it('passes arguments on to console.group', function () {
      Logger.group(Logger.INFO, 'Test Group');
      expect(groupStub).to.have.been.calledWith('Test Group');
    });
  });

  describe('#groupEnd', function () {
    it('calls console.groupEnd if maxLevel is < the current log level', function () {
      Logger.groupEnd(Logger.INFO);
      expect(groupEndStub).to.have.been.called;
    });

    it('does not call console.groupEnd if maxLevel is < the current log level', function () {
      Logger.groupEnd(Logger.DEBUG);
      expect(groupEndStub).to.not.have.been.called;
    });

    it('passes arguments on to console.groupEnd', function () {
      Logger.groupEnd(Logger.INFO, 'Test GroupEnd');
      expect(groupEndStub).to.have.been.calledWith('Test GroupEnd');
    });
  });
})
