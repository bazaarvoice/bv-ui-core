/**
 * @fileOverview Utility for determining if browser is in highcontrast mode
 * Originally from Firebird's util directory.
 *
 * High contrast mode overwrites a website's choice of colors with a user's
 * or OS's. This naturally can play havoc with the visual display of information.
 * Detecting and using alternative styles can improve a user's experience.
 */

function checkHighContrast (body) {
  var div = document.createElement('div');
  div.style['background-color'] = 'blue';
  body.appendChild(div);
  // Some IE's do not have access to getComputedStyle and need to use
  // elem.currentStyle instead. The results are not the same but either
  // option should reveal whether the browser is interfering.
  var styleAccessor = (window.getComputedStyle && window.getComputedStyle(div)) || div.currentStyle;
  var color = styleAccessor['background-color'];

  body.removeChild(div);

  // We may get back the color in an rgb format, we should consider that acceptable
  if (color === 'rgb(0, 0, 255)') {
    return false;
  }

  if (color === 'blue') {
    return false;
  }

  // At this point, the color isn't one of the two possible valid results for
  // blue, so we're assuming that high-contrast mode is altering our visual.
  return true;
}

module.exports = checkHighContrast;
