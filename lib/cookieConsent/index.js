var cookieConsent = (function () {
  var init = false;
  var consentDisabled = true;
  var store = {};
  var subscribers = {};
  var events = ['add', 'enable', 'disable', 'change'];
  var storeCallbacks = {};


  /**
   * _publish: Calls subscriber callbacks
   * @param {String} consentKey Consent key
   * @param {String} eventName Event name
   * @param {Boolean} data Consent value
   */
  function _publish (consentKey, eventName, data) {
    if (subscribers[consentKey] && subscribers[consentKey][eventName]) {
      Object.values(subscribers[consentKey][eventName]).forEach(function (callback) {
        callback(data);
      })
    }
  }

  /**
   * _publishStore: calls Callbacks with the store object passed
   */

  function _publishStore () {
    if (Object.values(storeCallbacks).length > 0) {
      Object.values(storeCallbacks).forEach(function (callback) {
        callback(Object.assign({}, store));
      })
    }
  }
  /**
   * _set: Set store data
   * @param {String} consentKey Consent key
   * @param {String} consentValue Consent value
   */
  function _set (consentKey, consentValue) {
    if (typeof consentValue !== 'boolean') {
      throw new TypeError('cookieConsent (setConsent): consent values should be of type boolean. Check value for ' + consentKey + '.');
    }

    var oldValue = store[consentKey];

    if (oldValue !== consentValue) {
      store[consentKey] = consentValue;

      if (oldValue === undefined) {
        _publish(consentKey, 'add', consentValue);
      }
      if (oldValue === true) {
        _publish(consentKey, 'disable', consentValue);
        _publish(consentKey, 'change', consentValue);
      }
      else if (oldValue === false) {
        _publish(consentKey, 'enable', consentValue);
        _publish(consentKey, 'change', consentValue);
      }
      else {
        _publish(consentKey, 'change', consentValue);
      }
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
   * _unsubscribeStore: Unsubscribes subscribers from the consent store 
   */
  function _unsubscribeStore () {
    if (storeCallbacks[this.key]) {
      delete storeCallbacks[this.key];
    }
  }
  /**
   * Get consent disabled
   * @returns Boolean
   */
  function getConsentDisabled () {
    return consentDisabled
  }
  /**
   * initConsent: Initialize the consent store
   * @param {Object} consent Consent object
   * @param {Boolean} disable Disable consent
   * @returns Boolean
   */
  function initConsent (consent, disable) {
    if (!init) {
      consentDisabled = !!disable;

      if (consentDisabled) {
        init = true;
        return true;
      }

      if (!(consent && !Array.isArray(consent) && typeof consent === 'object')) {
        throw new TypeError('cookieConsent (init): consent should be an object.');
      }

      var keys = Object.keys(consent);

      for (var i = 0; i < keys.length; i++) {
        if (typeof consent[keys[i]] !== 'boolean') {
          throw new TypeError('cookieConsent (init): consent values for ' + keys[i] + ' should be of type boolean.');
        }
      }

      store = Object.assign({}, consent);
      init = true;
      return true;
    }

    return false;
  }
  /**
   * getConsent: Get consent value from store
   * @param {String} consentKey Consent key
   * @returns Boolean or Undefined
   */
  function getConsent (consentKey) {
    if (consentDisabled) {
      return true;
    }

    return store[consentKey];
  }
  /**
   * setConsent: Set consent values in the store
   * @param {Object} consent Consent object
   * @returns Boolean
   */
  function setConsent (consent) {
    if (init && !consentDisabled) {
      if (!(consent && !Array.isArray(consent) && typeof consent === 'object')) {
        throw new TypeError('cookieConsent (setConsent): consent should be an object.')
      }
      var store 
      var keys = Object.keys(consent);
      for (var i = 0; i < keys.length; i++) {
        _set(keys[i], consent[keys[i]]);
      }
      var storeCopy=Object.assign({},store)
      if (JSON.stringify(storeCopy)!==JSON.stringify(store)) {
        _publishStore()
      }
      return true;
    }

    return false;
  }
  /**
   * subscribe: Subscribe to store events
   * @param {String} consentKey Consent key
   * @param {String} eventName Event name
   * @param {Function} callback Event callback
   * @returns Object: Contains unsubscribe method
   */
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

  function subscribeToConsentStore (callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('cookieConsent (subscribeToConsentStore): callback should be a function.');
    }

    var key = Math.random().toString(36).substr(2, 5);
    storeCallbacks[key] = callback;

    return {
      unsubscribe: _unsubscribeStore.bind({ key: key })
    }
  }

  return {
    initConsent: initConsent,
    getConsent: getConsent,
    getConsentDisabled: getConsentDisabled,
    setConsent: setConsent,
    subscribe: subscribe,
    subscribeToConsentStore: subscribeToConsentStore
  };
})();

module.exports = cookieConsent;
