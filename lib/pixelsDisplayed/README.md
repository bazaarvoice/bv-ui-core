# pixelsDisplayed

> A module for detecting whether an element is located within the viewport

## Usage

```js
var bvUIPixelsDisplayed = require('bv-ui-core/lib/pixelsDisplayed');
var pixelsDisplayedVertical = bvUIPixelsDisplayed.pixelsDisplayedVertical;
var pixelsDisplayedHorizontal = bvUIPixelsDisplayed.pixelsDisplayedHorizontal;


if (pixelsDisplayedVertical(element) > 0) {
  // element is vertically within viewport
  if (pixelsDisplayedHorizontal(element) > 0) {
    // element is both vertically and horizontally within viewport
  }
}
```
