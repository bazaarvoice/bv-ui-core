/**
 * @fileOverview
 * A module that provides a minimalist application class, useful for managing
 * configuration and rendering.
 */

// --------------------------------------------------------------------------
// Functions.
// --------------------------------------------------------------------------

/**
 * Process a queue.
 *
 * @param {Mixed[]} queue An array of queued items.
 * @param {Function} fn The function to process queue items.
 * @param {Boolean} sync If true, process synchronously.
 */
function processQueue (queue, fn, sync) {
  if (typeof fn !== 'function') {
    throw new Error('A function must be provided to process the queue');
  }

  var originalLength = queue.length;

  function dequeue () {
    var queueItem = queue.shift();

    if (sync) {
      fn(queueItem);
      return;
    }

    setTimeout(function () {
      fn(queueItem);
    }, 0);
  }

  while (queue.length > 0) {
    dequeue();
  }

  return originalLength;
}

// --------------------------------------------------------------------------
// Application class definition.
// --------------------------------------------------------------------------

/**
 * @class
 * An application framework capable of managing render and configuration queues.
 *
 * @param {Object} config Application configuration.
 */
function Application (config) {
  this.config = config;
  this._readyQueue = [];
  this._renderQueue = [];
  this._configQueue = [];
  this._paintsQueue = [];
  this._promise = new Promise(function (resolve, reject) {
    this._resolve = resolve;
    this._reject = reject;
  }.bind(this));
  return this;
}

/**
 * A method that can be called before the "real" application is
 * loaded; its job is to queue the ready callbacks that are passed,
 * so that they can be called when the real app arrives.
 */
Application.prototype.ready = function (callback) {
  if (typeof callback === 'function') {
    this._readyQueue.push(callback);
  }

  return this._promise;
};

/**
 * A method that can be called before the "real" application is
 * loaded; its job is to queue the render configuration objects that
 * are passed, so that they can be handled when the real app arrives.
 */
Application.prototype.render = function (config) {
  return this._renderQueue.push(config);
};

/**
 * A method that can be called before the "real" application is
 * loaded; its job is to queue the applicaiton configuration objects
 * that are passed, so that they can be handled when the real app
 * arrives.
 */
Application.prototype.configure = function (config) {
  return this._configQueue.push(config);
};

/**
 * The function to be passed to our processQueue function when processing
 * ready callbacks below.
 */
var processReadyFn = function (err, callback) {
  if (typeof callback === 'function') {
    callback(err, this);
  }
};

/**
 * To be called by the real application once it is loaded and its API
 * is fully available to consumers. It processes any passed callbacks as a
 * queue, then redefines the ready method to process incoming callbacks
 * immediately. If the current runtime also supports Promises, this will
 * return a Promise handle that can be used to queue up additional callbacks.
 *
 * @param  [Function] callback An optional function to be queued for
 * processing. Any queued callbacks will be processed prior to resolving the
 * Promise, if Promises are supported.
 * @return {Promise} A Promise handle to use for additional callbacks.
 */
Application.prototype.processReady = function (err) {
  var processReady = processReadyFn.bind(this, err);
  processQueue.call(this, this._readyQueue, processReady, true);

  this._readyQueue.push = processReady;

  this.ready = function (callback) {
    processReady(callback);
    return this._promise;
  };
  if (err) {
    this._reject(err);
  }
  else {
    this._resolve(this);
  }
};

/**
 * To be called by the real application once it is ready to handle
 * queued render calls. It processes the queue using the provided
 * handler, then redefines the render method using the provided handler.
 *
 * @param  {Function} fn The function to handle the queued items; this function
 * will also effectively replace the render method.
 * @return {Number} The number of items that were queued.
 */
Application.prototype.processQueue = function (fn) {
  processQueue.call(this, this._renderQueue, fn);
  this.render = this._renderQueue.push = fn;
};

/**
 * To be called by the real application once it is ready to handle
 * queued configure calls. It processes the queue using the provided
 * handler, then redefines the configure method using the provided handler.
 *
 * @param {Function} fn The function to handle the queued items; this function
 *   will also effectively replace the configure method.
 * @return {Number} The number of items that were queued.
 */
Application.prototype.processConfig = function (fn) {
  processQueue.call(this, this._configQueue, fn, true);
  this.configure = this._configQueue.push = fn;
};

/**
 * @param {Function} fn Function that can be queued to be executed
 */

Application.prototype.queuePaintFunctions = function(fn) {
  this._paintsQueue.push(fn);
}

/**
 * To be called by application after the interface has been painted
 */

Application.prototype.processQueuedPaintFunctions = function() {
  this._paintsQueue.forEach((fn) => fn())
}

// --------------------------------------------------------------------------
// Exports class definition.
// --------------------------------------------------------------------------

module.exports = Application;
