/**
 * @fileOverview
 * Unit tests for the performance/getEntriesByType.js module.
 */

// Imports.
var perfGetEntriesByType = require('../../../lib/performance/getEntriesByType.js');
var perfMark = require('../../../lib/performance/mark.js');

describe('lib/performance/getEntriesByType', function () {
  before(function () {
    //Clearing all the marks as marks from other tests were being added
    performance.clearMarks()
    perfMark.mark('test-by-name1');
    perfMark.mark('test-by-name2');
  });

  it('returns an array of all matching performance marks by type', function () {
    var result = perfGetEntriesByType.getEntriesByType('mark');
    console.log(result)
    // Test 1: it returns an array.
    expect(result).to.be.an('array');

    // Test 2: the array contains the relevant number of performance marks.
    expect(result.length).to.equal(2);

    // Test 3: the arrays contain the relevant performance marks themselves.
    // In order to make sure we're only checking marks created
    // in *this* test, we use the *last* 2 marks, rather than
    // hardcoding indexes 0 and 1, in case other tests make marks.
    expect(result[result.length-2].name).to.equal('test-by-name1');
    expect(result[result.length-1].name).to.equal('test-by-name2');
  });

  it('returns an empty array if no entryType match is found', function () {
    var result = perfGetEntriesByType.getEntriesByType('unknown-type');

    // Test 1: it returns an array.
    expect(result).to.be.an('array');

    // Test 2: the array contains no performance marks.
    expect(result.length).to.equal(0);
  });

  it('throws an error if no arguments are passed', function () {
    expect(perfGetEntriesByType.getEntriesByType()).to.be.empty;
  });

});
