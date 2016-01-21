# Region

The `region` module is a module meant to standardize the detection of various
regions, such as EU or APAC. It exposes functions that can test if a locale
belongs to various regions.

So far, the only region supported is EU, but the module is designed to be
easily extendable when the need to support other regions pops up.

## Usage Examples

Loading the root module:
```javascript
var region = requrie('bv-ui-core/lib/region');

region.isEULocale('en_US'); // false
region.isEULocale('en_GB'); // true
```
This can be useful when you'll have to support detection of multiple regions.
As only the EU region is supported for now, it's not particularly useful yet.

Loading a specific region module:
```javascript
var isEULocale = require('bv-ui-core/lib/region/EU');

isEULocale('en_US'); // false
isEULocale('en_GB'); // true
```
