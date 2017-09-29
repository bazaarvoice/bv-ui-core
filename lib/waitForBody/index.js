/**
 * This file exposes a single function that can be used to monitor for
 * document.body to come into existence. It does not mean that its DOM
 * is loaded, it only means that the document.body node has been created.
 */

function checkForBody (callback, documentMutationObserver) {
  if (document.body) {
    // Stop observing the root documentElement
    documentMutationObserver.disconnect()

    // Invoke the callback
    callback()
  }
}

module.exports = function waitForBody (callback) {
  // If document.body is ready, bail early
  if (document.body) {
    callback()
    return
  }

  // In case the document.body element doesn't exist yet, set up a mutation
  // observer on document.documentElement, and each time it's triggered,
  // check for document.body... When it exists, stop observing this.
  const documentMutationObserver = new MutationObserver(function () {
    checkForBody(callback, documentMutationObserver)
  })

  // Attach to document.documentElement for monitoring
  documentMutationObserver.observe(document.documentElement, { childList: true, subtree: true })

  // Invoke once, in case document.body already exists
  checkForBody(callback, documentMutationObserver)
}
