/**
 *  @fileOverview
 *  Groups Performance sub-modules to keep them clean and testable
 */

module.exports.getEntries = require('./getEntries.js').getEntries;
module.exports.getEntriesByName = require('./getEntriesByName.js').getEntriesByName;
module.exports.getEntriesByType = require('./getEntriesByType.js').getEntriesByType;
module.exports.now = require('./now.js').now;
module.exports.mark = require('./mark.js').mark;
module.exports.measure = require('./measure.js').measure;
