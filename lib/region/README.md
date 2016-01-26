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
var region = require('bv-ui-core/lib/region');

region.hasLocale('europe', 'en_US'); // false
region.hasLocale('europe', 'en_GB'); // true

region.hasTerritory('europe', 'US'); // false
region.hasTerritory('europe', 'GB'); // true

region.lookupTerritory('US'); // unsupported
region.lookupTerritory('GB'); // europe

region.lookupLocale('en_US'); // unsupported
region.lookupLocale('en_GB'); // europe

```
This can be useful when you'll have to support detection of multiple regions.
As only the EU region is supported for now, it's not particularly useful yet.

Loading a specific region module:
```javascript
var europe = require('bv-ui-core/lib/region/europe');

europe.hasLocale('en_US'); // false
europe.hasLocale('en_GB'); // true

europe.hasTerritory('US'); // false
europe.hasTerritory('GB'); // true

// Get an Array with all the region's country codes.
var europeanTerritories = europe.listTerritories();

// If you prefer a map, you can require it directly.
var europeanTerritoryMap = require('bv-ui-core/lib/region/europe/territories');
```
This can be useful if you've no need for other regions and would like to shave
every last byte from your client-side code.
