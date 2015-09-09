function GM_xmlhttpRequest(details, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        callback({
          responseText: xhr.responseText,
          error: xhr.error,
        });
      }
      else {
        callback(null);
      }
    }
  }
  xhr.open('GET', details.url, true);
  xhr.send();
};

/**
 * Handles data sent via chrome.extension.sendRequest().
 * @param request Object Data sent in the request.
 * @param sender Object Origin of the request.
 * @param callback Function The method to call when the request completes.
 */
function onRequest(request, sender, callback) {
  // Only supports the 'fetchTwitterFeed' method, although this could be
  // generalized into a more robust RPC system.
  if (request.action == 'fetchTwitterFeed') {
    fetchTwitterFeed(callback);
  }
  else if (request.action == 'GM_xmlhttpRequest') {
    GM_xmlhttpRequest(request.details, callback);
  }
};

// Wire up the listener.
chrome.extension.onRequest.addListener(onRequest);
