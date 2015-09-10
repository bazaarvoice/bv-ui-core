/**
 * @fileOverview Checks visibility of an element by calculating the
 * visible pixels for vertical and horizontal viewport.
 * This is a migration of repository bv-ui-pixels-displayed
 */
var global = require('../global');

function getDimensions () {
  var window = global;
  var docEl = window.document && window.document.documentElement;
  return {
    height: window.innerHeight || docEl.clientHeight,
    width: window.innerWidth || docEl.clientWidth
  };
}

function pixelsDisplayedVertical (el) {
  var rect = el.getBoundingClientRect();
  var displayed;
  var windowHeight = module.exports.getDimensions().height;

  // There are five potential DOM node positions relative to the viewport:
  // * Completely above the viewport, not visible
  // * Completely below the viewport, not visible
  // * A top portion (or all) of the DOM node is visible
  // * A middle portion of the DOM node is visible
  // * A bottom portion of the DOM node is visible

  if (rect.top <= 0) {
    // The top of the node is at or above the top of the viewport,
    // so the top plus its height would be how much is shown.
    // However, we never want to provide a negative number for amount displayed.
    displayed = Math.max(rect.top + rect.height, 0);

    // Once we know how much is potentially showing, we want to ensure that we don't over-report.
    // If the window height is less than our calculated display, use that.
    displayed = Math.min(displayed, windowHeight);

    // Cases handled:
    // * Completely above the viewport, not visible
    //   * First displayed value would be 0, as the sum would be negative and so Math.max would return 0
    //   * Second displayed will remain 0, as that is (hopefully) less than viewport height
    // * A middle portion of the DOM node is visible, or a bottom portion of the DOM node is visible
    //   * First displayed value will be the height of the DOM node below the top of the viewport
    //   * Second displayed value will be either that height, or the height of the viewport itself

    return displayed;
  }

    // If the top of our rectangle is greater than the viewport's height,
    // we're not visible, as the node is completely below the viewport.
  if (rect.top >= windowHeight) { return 0; }

  // At this point, the only remaining case is that the top of the DOM node is
  // somewhere in the viewport. We can determine the maximum possible amount
  // displayed rather easily, by determining how much distance there is between
  // the top of the bounding rectangle and the viewport's height.
  // However, if this is larger than our DOM node, we don't want to report more
  // displayed than the node's full height;
  return Math.min(windowHeight - rect.top, rect.height);
}

function pixelsDisplayedHorizontal (el) {
  var rect = el.getBoundingClientRect();
  var displayed;

  var windowWidth = module.exports.getDimensions().width;

  // There are five potential DOM node positions relative to the viewport:
  // * Completely to the left of the viewport, not visible
  // * Completely to the right of the viewport, not visible
  // * A left portion (or all) of the DOM node is visible
  // * A middle portion of the DOM node is visible
  // * A right portion of the DOM node is visible

  if (rect.left <= 0) {
    // The left of the node is at or to the left of the viewport,
    // so the left plus its width would be how much is shown.
    // However, we never want to provide a negative number for amount displayed.
    displayed = Math.max(rect.left + rect.width, 0);

    // Once we know how much is potentially showing, we want to ensure that we don't over-report.
    // If the window weight is less than our calculated display, use that.
    displayed = Math.min(displayed, windowWidth);

    // Cases handled:
    // * Completely to the left of the viewport, not visible
    //   * First displayed value would be 0, as the sum would be negative and so Math.max would return 0
    //   * Second displayed will remain 0, as that is (hopefully) less than viewport width
    // * A middle portion of the DOM node is visible, or a right portion of the DOM node is visible
    //   * First displayed value will be the width of the DOM node to the right of the left border of the viewport
    //   * Second displayed value will be either that width, or the width of the viewport itself

    return displayed;
  }

  // If the left of our rectangle is greater than the viewport's width,
  // we're not visible, as the node is completely to the right of the viewport.
  if (rect.left >= windowWidth) { return 0; }

  // At this point, the only remaining case is that the left of the DOM node is
  // somewhere in the viewport. We can determine the maximum possible amount
  // displayed rather easily, by determining how much distance there is between
  // the left of the bounding rectangle and the viewport's width.
  // However, if this is larger than our DOM node, we don't want to report more
  // displayed than the node's full width;
  return Math.min(windowWidth - rect.left, rect.width);
}

module.exports = { getDimensions: getDimensions,
  pixelsDisplayedHorizontal: pixelsDisplayedHorizontal,
  pixelsDisplayedVertical: pixelsDisplayedVertical
};
