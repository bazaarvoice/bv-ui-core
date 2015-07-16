/**
 *  @fileOverview Groups Performance modules in one place to keep sub-modules
 *  clean and testable
 */

// Performance.now is a reference to the now module's now function
// and Performance.mark references mark's mark function
module.exports.now = require('./now.js').now;
module.exports.mark = require('./mark.js').mark;
