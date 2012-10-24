/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Attaching to implementation
cDocument.prototype.releaseCapture	= function() {
	if (oBrowser_captureNode)
		fCaptureManager_releaseCapture(oBrowser_captureNode);
};

function fCaptureManager_setCapture(oNode, bCapture) {
	if (oBrowser_captureNode != oNode) {
		// Release capture from the previous element
		var oElement	= oBrowser_captureNode;
		if (oElement && oElement != oNode)
			fCaptureManager_releaseCapture(oElement);

		//
		oBrowser_captureNode	= oNode;
	}
};

cElement.prototype.setCapture	= function(bCapture) {
//->Guard
	fGuard(arguments, [
		["useCapture",	cBoolean, true]
	]);
//<-Guard

	// Raise NOT_SUPPORTED_ERR exception in case setCapture(false) called
	if (arguments.length && !bCapture)
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);

	fCaptureManager_setCapture(this, bCapture);
};

function fCaptureManager_releaseCapture(oNode) {
	if (oBrowser_captureNode == oNode) {
		// Notify element on capture lose
		var oEvent	= new cUIEvent;
		oEvent.initUIEvent("losecapture", false, false, window, null);
		fEventTarget_dispatchEvent(oNode, oEvent);

		//
		oBrowser_captureNode	= null;
	}
};

cElement.prototype.releaseCapture	= function() {
	fCaptureManager_releaseCapture(this);
};
