/**
 * @fileOverview
 * Unit tests for the Pixels Displayed module.
 */

var module = require('../../../lib/pixelsDisplayed');

describe('lib/pixelsDisplayed', function () {
  var pixelsDisplayedVertical;
  var pixelsDisplayedHorizontal;
  var sinonSandbox, stub;

  var rect = {};

  var el = {
    getBoundingClientRect: function () {
      return rect;
    }
  };

  function stubAccessor () {
    sinonSandbox = sinon.sandbox.create();
    stub = sinonSandbox.stub(module, 'getDimensions', function () {
      return {
        width: 500,
        height: 500
      }
    });
  }

  before(function () {
    pixelsDisplayedVertical = module.pixelsDisplayedVertical;
    pixelsDisplayedHorizontal = module.pixelsDisplayedHorizontal;
  });

  beforeEach(function () {
    stubAccessor();
    rect = {
      height: 200,
      top: 100,
      width: 200,
      left: 100
    };
  });

  afterEach(function () {
    // we do expect stubbed method to have been called during each test
    sinon.assert.called(stub);
    sinonSandbox.restore();
  });

  describe('element is hidden vertically', function () {
    describe('element is smaller than viewport', function () {
      it('should be hidden when element is way above viewport', function () {
        rect.top = -9999;

        expect(pixelsDisplayedVertical(el)).to.eql(0);
      });

      it('should be hidden when element is right above viewport', function () {
        rect.top = -200;

        expect(pixelsDisplayedVertical(el)).to.eql(0);
      });

      it('should be hidden when element is way below viewport', function () {
        rect.top = 9999;

        expect(pixelsDisplayedVertical(el)).to.eql(0);
      });

      it('should be hidden when element is right below viewport', function () {
        rect.top = 500;

        expect(pixelsDisplayedVertical(el)).to.eql(0);
      });
    });

    describe('element is bigger than viewport', function () {
      beforeEach(function () {
        rect.height = 1000;
      });

      it('should be hidden when element is way above viewport', function () {
        rect.top = -9999;

        expect(pixelsDisplayedVertical(el)).to.eql(0);
      });

      it('should be hidden when element is right above viewport', function () {
        rect.top = -1000;

        expect(pixelsDisplayedVertical(el)).to.eql(0);
      });

      it('should be hidden when element is way below viewport', function () {
        rect.top = 9999;

        expect(pixelsDisplayedVertical(el)).to.eql(0);
      });

      it('should be hidden when element is right below viewport', function () {
        rect.top = 1000;

        expect(pixelsDisplayedVertical(el)).to.eql(0);
      });
    });
  });

  describe('element is hidden horizontally', function () {
    describe('element is smaller than viewport', function () {
      it('should be hidden when element is way to the left of the viewport', function () {
        rect.left = -9999;

        expect(pixelsDisplayedHorizontal(el)).to.eql(0);
      });

      it('should be hidden when element is just to the left of the viewport', function () {
        rect.left = -200;

        expect(pixelsDisplayedHorizontal(el)).to.eql(0);
      });

      it('should be hidden when element is way to the right of the viewport', function () {
        rect.left = 9999;

        expect(pixelsDisplayedHorizontal(el)).to.eql(0);
      });

      it('should be hidden when element is just to the right of the viewport', function () {
        rect.left = 500;

        expect(pixelsDisplayedHorizontal(el)).to.eql(0);
      });
    });

    describe('element is bigger than viewport', function () {
      beforeEach(function () {
        rect.width = 1000;
      });

      it('should be hidden when element is way to the left of the viewport', function () {
        rect.left = -9999;

        expect(pixelsDisplayedHorizontal(el)).to.eql(0);
      });

      it('should be hidden when element is just to the left of the viewport', function () {
        rect.left = -1000;

        expect(pixelsDisplayedHorizontal(el)).to.eql(0);
      });

      it('should be hidden when element is way to the right of the viewport', function () {
        rect.left = 9999;

        expect(pixelsDisplayedHorizontal(el)).to.eql(0);
      });

      it('should be hidden when element is just to the right of the viewport', function () {
        rect.left = 1000;

        expect(pixelsDisplayedHorizontal(el)).to.eql(0);
      });
    });
  });

  describe('element is visible vertically', function () {
    describe('element is smaller than viewport', function () {
      it('element should be visible when top position is 0', function () {
        rect.top = 0;

        expect(pixelsDisplayedVertical(el)).to.eql(200);
      });

      it('element should be visible when top position is greater than 0', function () {
        rect.top = 499;

        expect(pixelsDisplayedVertical(el)).to.eql(1);
      });

      it('element should be visible when top position is less than 0', function () {
        rect.top = -199;

        expect(pixelsDisplayedVertical(el)).to.eql(1);
      });
    });

    describe('element is bigger than viewport', function () {
      beforeEach(function () {
        rect.height = 1000;
      });

      it('element should be visible when top position is 0', function () {
        rect.top = 0;

        expect(pixelsDisplayedVertical(el)).to.eql(500);
      });

      it('element should be visible when top position is greater than 0', function () {
        rect.top = 100;

        expect(pixelsDisplayedVertical(el)).to.eql(400);
      });

      it('element should be visible when top position is less than 0', function () {
        rect.top = -600;

        expect(pixelsDisplayedVertical(el)).to.eql(400);
      });
    });
  });

  describe('element is visible horizontally', function () {
    describe('element is smaller than viewport', function () {
      it('element should be visible when left position is 0', function () {
        rect.left = 0;

        expect(pixelsDisplayedHorizontal(el)).to.eql(200);
      });

      it('element should be visible when left position is greater than 0', function () {
        rect.left = 499;

        expect(pixelsDisplayedHorizontal(el)).to.eql(1);
      });

      it('element should be visible when left position is less than 0', function () {
        rect.left = -199;

        expect(pixelsDisplayedHorizontal(el)).to.eql(1);
      });
    });

    describe('element is bigger than viewport', function () {
      beforeEach(function () {
        rect.width = 1000;
      });

      it('element should be visible when left position is 0', function () {
        rect.left = 0;

        expect(pixelsDisplayedHorizontal(el)).to.eql(500);
      });

      it('element should be visible when left position is greater than 0', function () {
        rect.left = 100;

        expect(pixelsDisplayedHorizontal(el)).to.eql(400);
      });

      it('element should be visible when left position is less than 0', function () {
        rect.left = -600;

        expect(pixelsDisplayedHorizontal(el)).to.eql(400);
      });
    });
  });

  it('Accessor function is working correctly', function () {
    // Special case, we actually want to call the real function, so restore
    // sandbox
    sinonSandbox.restore();
    var dimensions = module.getDimensions();
    expect(dimensions.width).to.equal(window.innerWidth);
    expect(dimensions.height).to.equal(window.innerHeight);
    // And then re-set-it-up again and call method
    stubAccessor();
    dimensions = module.getDimensions();
  })
});