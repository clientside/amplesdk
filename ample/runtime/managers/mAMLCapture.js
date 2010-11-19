/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Attaching to implementation
cAMLDocument.prototype.releaseCapture	= function() {
	if (oBrowser_captureNode)
		fAMLCapture_releaseCapture(oBrowser_captureNode);
};

function fAMLCapture_setCapture(oNode, bCapture) {
	if (oBrowser_captureNode != oNode) {
		// Release capture from the previous element
		var oElement	= oBrowser_captureNode;
		if (oElement && oElement != oNode)
			fAMLCapture_releaseCapture(oElement);

		//
		oBrowser_captureNode	= oNode;
	}
};

cAMLElement.prototype.setCapture	= function(bCapture) {
//->Guard
	fGuard(arguments, [
		["useCapture",	cBoolean, true]
	]);
//<-Guard

	// Raise NOT_SUPPORTED_ERR exception in case setCapture(false) called
	if (arguments.length && !bCapture)
		throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);

	fAMLCapture_setCapture(this, bCapture);
};

function fAMLCapture_releaseCapture(oNode) {
	if (oBrowser_captureNode == oNode) {
		// Notify element on capture lose
		var oEvent	= new cAMLUIEvent;
		oEvent.initUIEvent("losecapture", false, false, window, null);
		fAMLNode_dispatchEvent(oNode, oEvent);

		//
		oBrowser_captureNode	= null;
	}
};

cAMLElement.prototype.releaseCapture	= function() {
	fAMLCapture_releaseCapture(this);
};
