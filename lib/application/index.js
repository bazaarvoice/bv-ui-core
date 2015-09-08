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
  this._renderQueue = [];
  this._configQueue = [];
  return this;
}

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

// --------------------------------------------------------------------------
// Exports class definition.
// --------------------------------------------------------------------------

module.exports = Application;
