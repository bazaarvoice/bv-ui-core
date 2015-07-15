/**
 *  @fileOverview Groups Performance modules in one place to keep sub-modules
 *  clean and testable
 */

// Performance.now is a reference to the now module's now function
module.exports.now = require('./now.js').now;
