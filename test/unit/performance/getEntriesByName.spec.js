/**
 * @fileOverview
 * Unit tests for the performance/getEntriesByName.js module.
 */

// Imports.
var perfGetEntriesByName = require('../../../lib/performance/getEntriesByName.js');
var perfMark = require('../../../lib/performance/mark.js');

describe('lib/performance/getEntriesByName', function () {
  before(function () {
    perfMark.mark('test-by-name1');
    perfMark.mark('test-by-name2');
    perfMark.mark('test-by-name2');
  });

  it('returns an array of all matching performance marks by name', function () {
    var result1 = perfGetEntriesByName.getEntriesByName('test-by-name1');
    var result2 = perfGetEntriesByName.getEntriesByName('test-by-name2');

    // Test 1: it returns an array.
    expect(result1).to.be.an('array');
    expect(result2).to.be.an('array');

    // Test 2: the arrays contain the relevant number of performance marks.
    expect(result1.length).to.equal(1);
    expect(result2.length).to.equal(2);

    // Test 3: the arrays contain the relevant performance marks themselves.
    // In order to make sure we're only checking marks created
    // in *this* test, we use the *last* 2 marks, rather than
    // hardcoding indexes 0 and 1, in case other tests make marks.
    expect(result1[result1.length-1].name).to.equal('test-by-name1');
    expect(result2[result2.length-2].name).to.equal('test-by-name2');
    expect(result2[result2.length-1].name).to.equal('test-by-name2');
  });

  it('returns an array of all matching performance marks by name and entryType', function () {
    var result1 = perfGetEntriesByName.getEntriesByName('test-by-name1', 'mark');
    var result2 = perfGetEntriesByName.getEntriesByName('test-by-name2', 'mark');

    // Test 1: it returns an array.
    expect(result1).to.be.an('array');
    expect(result2).to.be.an('array');

    // Test 2: the arrays contain the relevant number of performance marks.
    expect(result1.length).to.equal(1);
    expect(result2.length).to.equal(2);

    // Test 3: the arrays contain the relevant performance marks themselves.
    // In order to make sure we're only checking marks created
    // in *this* test, we use the *last* 2 marks, rather than
    // hardcoding indexes 0 and 1, in case other tests make marks.
    expect(result1[result1.length-1].name).to.equal('test-by-name1');
    expect(result2[result2.length-2].name).to.equal('test-by-name2');
    expect(result2[result2.length-1].name).to.equal('test-by-name2');
  });

  it('returns an empty array if no name match is found', function () {
    var result = perfGetEntriesByName.getEntriesByName('test-by-name3');

    // Test 1: it returns an array.
    expect(result).to.be.an('array');

    // Test 2: the array contains no performance marks.
    expect(result.length).to.equal(0);
  });

  it('returns an empty array if no entryType match is found', function () {
    var result = perfGetEntriesByName.getEntriesByName('test-by-name1', 'paint');

    // Test 1: it returns an array.
    expect(result).to.be.an('array');

    // Test 2: the array contains no performance marks.
    expect(result.length).to.equal(0);
  });

 
  it('throws an error if no arguments are passed', function () {
    //name is passed to the nativeImplementation which is undefined and returns an empty array 
    function test () {
      return perfGetEntriesByName.getEntriesByName()
    }
    expect(test()).to.be.empty;
  });

});
