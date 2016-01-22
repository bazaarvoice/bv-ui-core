# Region

The `region` module is a module meant to standardize the detection of various
regions, such as EU or APAC. It exposes functions that can test if a locale
belongs to various regions. It can also simply lookup the region for a given
locale.

So far, the only region supported is EU, but the module is designed to be
easily extendable when the need to support other regions pops up.

## Usage Examples

Loading the root module:
```javascript
var region = requrie('bv-ui-core/lib/region');

region.has('en_US', 'europe'); // false
region.has('en_GB', 'europe'); // true

region.lookup('GB'); // 'europe'
region.lookup('US'); // 'unsupported region'
```
This can be useful when you'll have to support detection of multiple regions.
As only the EU region is supported for now, it's not particularly useful yet.

Loading a specific region module:
```javascript
var europe = require('bv-ui-core/lib/region/europe');

europe.has('en_US'); // false
europe.has('en_GB'); // true

// Get an Array with all the region's country codes.
var europeanCountryList = europe.listCountryCodes();

// If you prefer a map, you can require it directly.
var europeanCountryMap = require('bv-ui-core/lib/region/europe/countryCodes');
```
