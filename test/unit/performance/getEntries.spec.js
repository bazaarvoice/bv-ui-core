/**
 * @fileOverview
 * Unit tests for the performance/getEntries.js module.
 */

// Imports.
var perfGetEntries = require('../../../lib/performance/getEntries.js');
var perfMark = require('../../../lib/performance/mark.js');

describe('lib/performance/getEntries', function () {
  before(function () {
    perfMark.mark('test1');
    perfMark.mark('test2');
  });

  it('returns an array of all performance marks', function () {
    var result = perfGetEntries.getEntries();

    // Test 1: it returns an array.
    expect(result).to.be.an('array');

    // Test 2: the array contains the relevant performance marks themselves.
    // In order to make sure we're only checking marks created
    // in *this* test, we use the *last* 2 marks, rather than
    // hardcoding indexes 0 and 1, in case other tests make marks.
    expect(result[result.length-2].name).to.equal('test1');
    expect(result[result.length-1].name).to.equal('test2');
  });

});
