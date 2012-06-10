function GM_xmlhttpRequest(details) {
    chrome.extension.sendRequest({'action': 'GM_xmlhttpRequest', 'details': details}, details.onload);
}
