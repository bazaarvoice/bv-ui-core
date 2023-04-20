/**
* Function to deterimine whether given node is shadow host. 
* @param {*} node Document node.
* @returns NodeFilter 
*/
function filterShadowHosts (node) {
  if (node.shadowRoot) {
    return NodeFilter.FILTER_ACCEPT;
  }
  return NodeFilter.FILTER_SKIP;
}

/**
 * The function finds all the shadow roots in a given root element and returns a list of them.
 * @param rootElement - The root element from which to start searching for shadow roots.
 * @returns a list of all the shadow roots found in the given root element and its descendants.
 */
function findShadowRoots (rootElement) {
  
  if (!rootElement) {
    return;
  }

  const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_ELEMENT, filterShadowHosts);
  let listOfShadowRoots = [];
  
  // Tree walker will not determine the rootElement. 
  if (rootElement.shadowRoot) {
    listOfShadowRoots.push(rootElement);
    listOfShadowRoots = listOfShadowRoots.concat(findShadowRoots(rootElement.shadowRoot));
  }

  // Traverse all the nodes.
  while (walker.nextNode()) {
    listOfShadowRoots.push(walker.currentNode);

    if (walker.currentNode.shadowRoot) {
      listOfShadowRoots = listOfShadowRoots.concat(findShadowRoots(walker.currentNode.shadowRoot));
    }
  
  }
  return listOfShadowRoots;
}

/**
 * This function finds elements within a shadow DOM that match a given selector.
 * @param shadowElement - A DOM element that has a shadow root. 
 * @param matchSelector - Criteria to select the elements in the dom starting with element as root element.
 * @returns The function `findElementsInShadowDomByMatchSector` returns a NodeList of all elements
 * within the shadow DOM of the `shadowElement` parameter that match the `matchSelector` parameter.
 */

function findElementsInShadowDomByMatchSector (shadowElement, matchSelector) {
  if (shadowElement && shadowElement.shadowRoot && matchSelector) {
    return shadowElement.shadowRoot.querySelectorAll(matchSelector)
  }
}

/**
 * Finds elements in the DOM including open shadowDOM.
 * @param {*} element Root element to query for particular elements 
 * @param {*} matchSelector Criteria to select the elements in the dom starting with element as root element.
 * @returns Nodes matching with match selector.
 */
function shadowQuerySelectorAll (element, matchSelector) {

  /* Checks if both `element` and `matchSelector` are truthy values. If either of
  them is falsy, it throws an error. */
  if (!(element && matchSelector)) {
    throw new Error(`Unable to find ${element} or ${matchSelector}`)
  }

  // Get the elements by query selector all.
  const nodeList = element.querySelectorAll(matchSelector);
  const shadowRoots = findShadowRoots(element);
  let elements = [];

  for (const rootElement of shadowRoots) {
    const filteredElements = findElementsInShadowDomByMatchSector(rootElement, matchSelector);
    if (filteredElements.length > 0) {
      elements.push(...filteredElements);
    }
  }

  return [...nodeList, ...elements];
}

module.exports = {
  findShadowRoots,
  filterShadowHosts,
  shadowQuerySelectorAll,
  findElementsInShadowDomByMatchSector
}