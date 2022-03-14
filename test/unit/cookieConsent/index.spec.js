/**
 * @fileOverview
 * Unit tests for the cookieConsent module.
 */
var cookieConsent = require('../../../lib/cookieConsent');

describe('lib/cookieConsent', function () {
  it('cookieConsent.initConsent', function () {
    function test1 () {
      cookieConsent.initConsent(true);
    }

    expect(test1).to.throw(TypeError, 'cookieConsent (init): consent should be an object.');

    function test2 () {
      cookieConsent.initConsent({
        key1: 1
      });
    }

    expect(test2).to.throw(TypeError, 'cookieConsent (init): consent values for key1 should be of type boolean.');

    function test3 () {
      return cookieConsent.initConsent({
        key1: false
      });
    }

    expect(test3()).to.be.true;
  });

  it('cookieConsent.getConsent', function () {
    expect(cookieConsent.getConsent('key1')).to.be.false;
    cookieConsent.setConsent({ key1: true });
    expect(cookieConsent.getConsent('key1')).to.be.true;
  });

  it('cookieConsent.setConsent', function () {
    function test1 () {
      cookieConsent.setConsent(null);
    }

    expect(test1).to.throw(TypeError, 'cookieConsent (setConsent): consent should be an object.');

    function test2 () {
      cookieConsent.setConsent({ key2: 1 });
    }

    expect(test2).to.throw(TypeError, 'cookieConsent (setConsent): consent values should be of type boolean. Check value for key2.');

    function test3 () {
      return cookieConsent.setConsent({ key2: false });
    }

    expect(test3()).to.be.true;
  });

  it('cookieConsent.subscribe', function () {
    function test1 () {
      cookieConsent.subscribe(1, 2, null);
    }

    expect(test1).to.throw(TypeError, 'cookieConsent (subscribe): consent key should be of type string.');

    function test2 () {
      cookieConsent.subscribe('key1', 2, null);
    }

    expect(test2).to.throw(TypeError, 'cookieConsent (subscribe): event name should be of type string.');

    function test3 () {
      cookieConsent.subscribe('key1', 'delete', null);
    }

    var events = ['add', 'enable', 'disable', 'change'];
    expect(test3).to.throw(TypeError, 'cookieConsent (subscribe): event name should be one of ' + events.join(', ') + '.');

    function test4 () {
      cookieConsent.subscribe('key1', 'enable', null);
    }

    expect(test4).to.throw(TypeError, 'cookieConsent (subscribe): callback should be a function.');

    function test5 () {
      return cookieConsent.subscribe('key1', 'enable', function () {});
    }
    expect(test5()).to.be.an('object');
  });
  it('cookieConsent.subscribeToConsentStore', function () {
    // Error checks - Correct errors are thrown
    function test6 () {
      cookieConsent.subscribeToConsentStore('Callback')
    }
    expect(test6).to.throw(TypeError,'cookieConsent (subscribeToConsentStore): callback should be a function.');
    // Subscriber creation test - The subscription gets created correctly
    function test7 () {
      return cookieConsent.subscribeToConsentStore(function () {});
    }
    expect(test7()).to.be.an('object');

    // Event listener test - The subscriber callback fires on store change
    var fn = sinon.spy()
    function test8 () {
      cookieConsent.subscribeToConsentStore(fn)
      cookieConsent.setConsent({ cookie4: true })
    }
    test8 ()
    sinon.assert.calledOnce(fn)
    // Unsubscribe test - Should be able to unsubscribe successfully (Should not fire the callback after unsubscription)
    var fn2 = sinon.spy()
    function test9 () {
      var event = cookieConsent.subscribeToConsentStore(fn2)
      event.unsubscribe()
      cookieConsent.setConsent({ cookie5: true })
    } 
    test9()
    sinon.assert.notCalled(fn2)
  });
});
