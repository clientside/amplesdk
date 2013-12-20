/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oXHTMLAccessKeyManager	= (function () {
	// Attaching manager to document
	ample.bind("keydown",	function(oEvent) {
		if (oEvent.altKey && oEvent.key != "Alt") {
			var aKey	= oEvent.key.match(/U\+([\dA-F]{4})/),
				sKey	= aKey ? String.fromCharCode(parseInt(aKey[1], 16)) : oEvent.key;
			//
			for (var nIndex = 0, aElements = this.getElementsByTagNameNS(cXHTMLElement.prototype.namespaceURI, "*"), oElement, oElementDOM; oElement = aElements[nIndex]; nIndex++) {
				if (oElement.tabIndex >= 0 && oElement.$isAccessible() && oElement.accessKey && oElement.accessKey.toUpperCase() == sKey) {
					if ((oElementDOM = oElement.$getContainer()) && oElementDOM.offsetHeight > 0) {
						// Invoke focus on component
						oElement.focus();
						// Prevent browser default action
						oEvent.preventDefault();
					}
					break;
				}
			}
		}
	});

	// Public Object
	return {

	}
})();
