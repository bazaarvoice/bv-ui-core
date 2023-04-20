# Query Shadow DOM Element

This file exposes multiple functions that can be used to query elements within the ShadowDOM. 

```javascript
  shadowQuerySelectorAll
  // Returns Nodes matching with match selector.
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `element` | `DOM Element` | **Required**. Root element to query for particular elements. |
| `matchSelector` | `string` | **Required**. Criteria to select the elements in the dom starting with element as root element. |


```javascript
  findShadowRoots
  // Returns a list of all the shadow roots found in the given root element and its descendants.
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `rootElement` | `DOM Element` | **Required**. The root element from which to start searching for shadow roots. |

```javascript
  filterShadowHosts
  // Returns NodeFilter.
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `node` | `DOM Element` | **Required**. Document node. |

```javascript
  findElementsInShadowDomByMatchSector
  // returns a NodeList of all elements within the shadow DOM of the shadowElement parameter that match the matchSelector parameter.
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `shadowElement` | `DOM Element` | **Required**. A DOM element that has a shadow root. |
| `matchSelector` | `string` | **Required**. Criteria to select the elements in the dom starting with element as root element. |

## Usage

```javascript


const { shadowQuerySelectorAll } = require('bv-ui-core/lib/queryShadowDomElement');

const nodeList = shadowQuerySelectorAll(document, '[data-bv-show='reviews']')

// ['div', 'div']
```