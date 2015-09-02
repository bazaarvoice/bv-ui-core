/**
 * @fileOverview
 * Unit tests for the performance/mark.js module.
 */

// Imports.
var perfMark = require('../../../lib/performance/mark.js');

describe('lib/performance/mark', function () {

  it('can create a mark', function () {
    var markName = 'test-mark';

    expect(function () { perfMark.mark(markName); }).to.not.throw(Error);
  });

  it('can create multiple marks', function () {
    var markName1 = 'test-mark-1';
    var markName2 = 'test-mark-2';

    expect(function () { perfMark.mark(markName1); }).to.not.throw(Error);
    expect(function () { perfMark.mark(markName2); }).to.not.throw(Error);
  });

  it('can create multiple marks of the same name', function () {
    var markName = 'test-mark';

    expect(function () { perfMark.mark(markName); }).to.not.throw(Error);
    expect(function () { perfMark.mark(markName); }).to.not.throw(Error);
    expect(function () { perfMark.mark(markName); }).to.not.throw(Error);
  });

  it('throws an error if the mark name is a reserved name', function () {
    // 'navigationStart' is part of the PerformanceTiming interface.
    var markName = 'navigationStart';

    expect(function () { perfMark.mark(markName); }).to.throw(Error);
  });

});
