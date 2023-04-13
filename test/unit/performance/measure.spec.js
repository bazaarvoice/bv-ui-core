/**
 * @fileOverview
 * Unit tests for the performance/measure.js module.
 */

// Imports.
var perfMark = require('../../../lib/performance/mark.js');
var perfMeasure = require('../../../lib/performance/measure.js');

describe('lib/performance/measure', function () {

  it('can create a measure', function () {
    var measureName = 'test-measure';

    expect(function () { perfMeasure.measure(measureName); }).to.not.throw(Error);
  });

  it('can create multiple measures', function () {
    var measureName1 = 'test-measure-1';
    var measureName2 = 'test-measure-2';

    expect(function () { perfMeasure.measure(measureName1); }).to.not.throw(Error);
    expect(function () { perfMeasure.measure(measureName2); }).to.not.throw(Error);
  });

  it('can create multiple measures of the same name', function () {
    var measureName = 'test-measure';

    expect(function () { perfMeasure.measure(measureName); }).to.not.throw(Error);
    expect(function () { perfMeasure.measure(measureName); }).to.not.throw(Error);
    expect(function () { perfMeasure.measure(measureName); }).to.not.throw(Error);
  });

  it('throws an error if the measure name is omitted', function () {
    expect(perfMeasure.measure()).to.be.empty;
  });

  it('throws an error if the startMark or endMark name is supplied, but is invalid', function () {
    var measureName = 'test-measure';
    var invalidMark = 'lskdjflskdjflskjdflskdjflsdkjflskdjflskfjlskdfjslkdfj';

    expect(function () { perfMeasure.measure(measureName, invalidMark); }).to.throw(Error);

    var validMark = 'valid-mark-name';
    perfMark.mark(validMark)

    expect(function () { perfMeasure.measure(measureName, validMark, invalidMark); }).to.throw(Error);
  });

});
