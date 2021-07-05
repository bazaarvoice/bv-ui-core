var cookieConsent = (function () {
  var init = false;
  var store = {};
  var subscribers = {};
  var events = ['add', 'enable', 'disable'];
  /**
   * _publish: Calls subscriber callbacks
   * @param {String} consentKey 
   * @param {String} eventName 
   * @param {Boolean} data 
   */
  function _publish (consentKey, eventName, data) {
    if (subscribers[consentKey] && subscribers[consentKey][eventName]) {
      Object.values(subscribers[consentKey][eventName]).forEach(function (callback) {
        callback(data);
      })
    }
  }
  /**
   * _unsubscribe: Unsubscribe subscribers
   */
  function _unsubscribe () {
    if (subscribers[this.consentKey] && subscribers[this.consentKey][this.eventName]) {
      delete subscribers[this.consentKey][this.eventName][this.key];
    }
  }
  /**
   * 
   */
  function initConsent (consent) {
    if (!init) {
      if (!(consent && !Array.isArray(consent) && typeof consent === 'object')) {
        throw new TypeError('cookieConsent (init): consent should be an object.');
      }

      var keys = Object.keys(consent);

      for (var i = 0; i < keys.length; i++) {
        if (!typeof consent[keys[i]] === 'boolean') {
          throw new TypeError('cookieConsent (init): consent values for ' + keys[i] + ' should be of type boolean.');
        }
      }

      store = Object.assign({}, consent);

      init = true;

      return true;
    }

    return false;
  }

  function getConsent (key) {
    return store[key];
  }

  function setConsent (consentKey, consentValue) {
    if (init) {
      if (typeof consentKey !== 'string') {
        throw new TypeError('cookieConsent (setConsent): consent key should be of type string.');
      }

      if (typeof consentValue !== 'boolean') {
        throw new TypeError('cookieConsent (setConsent): consent value should be of type boolean.');
      }

      var oldValue = store[consentKey];

      if (oldValue !== consentValue) {
        store[consentKey] = consentValue;

        if (oldValue === undefined) {
          _publish(consentKey, 'add', consentValue);
        }
        else if (!oldValue) {
          _publish(consentKey, 'enable', consentValue);
        }
        else {
          _publish(consentKey, 'disable', consentValue);
        }
      }
      return true;
    }

    return false;
  }

  function subscribe (consentKey, eventName, callback) {
    if (typeof consentKey !== 'string') {
      throw new TypeError('cookieConsent (subscribe): consent key should be of type string.');
    }

    if (typeof eventName !== 'string') {
      throw new TypeError('cookieConsent (subscribe): event name should be of type string.');
    }

    if (!events.includes(eventName)) {
      throw new TypeError('cookieConsent (subscribe): event name should be one of ' + events.join(', ') + '.');
    }

    if (typeof callback !== 'function') {
      throw new TypeError('cookieConsent (subscribe): callback should be a function.');
    }

    if (!subscribers[consentKey]) {
      subscribers[consentKey] = {};
    }

    if (!subscribers[consentKey][eventName]) {
      subscribers[consentKey][eventName] = {};
    }
    var key = Math.random().toString(36).substr(2, 5);

    subscribers[consentKey][eventName][key] = callback

    return {
      unsubscribe: _unsubscribe.bind({
        consentKey: consentKey,
        eventName: eventName,
        key: key
      })
    };
  }

  return {
    initConsent: initConsent,
    getConsent: getConsent,
    setConsent: setConsent,
    subscribe: subscribe
  };
})();

module.exports = cookieConsent;
