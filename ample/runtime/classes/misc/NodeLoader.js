/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Content Loader
function fNodeLoader_clear(oElement) {
	if (oElement._request)
		delete oElement._request;
	if (oElement._timeout) {
		fClearTimeout(oElement._timeout);
		delete oElement._timeout;
	}
	// Remove "load" pseudo-class
	fElement_setPseudoClass(oElement, "load", false);
};

function fNodeLoader_abort(oElement) {
	if (oElement._timeout || oElement._request) {
		if (oElement._request)
			oElement._request	= oElement._request.abort();
		fNodeLoader_clear(oElement);

		// Dispatch abort event
		var oEvent	= new cEvent;
		oEvent.initEvent("abort", false, false);
		fEventTarget_dispatchEvent(oElement, oEvent);
	}
};

function fNodeLoader_load(oElement, sUrl, vData, fCallback) {
	// If there is an operation running, abort it
	fNodeLoader_abort(oElement);

	// Dispatch unload event
	var oEvent	= new cEvent;
	oEvent.initEvent("unload", false, false);
	fEventTarget_dispatchEvent(oElement, oEvent);

	// Remove nodes
	while (oElement.lastChild)
		fElement_removeChild(oElement, oElement.lastChild);

	// Set "load" pseudo-class
	fElement_setPseudoClass(oElement, "load", true);

	// Do timeout before loading
	oElement._request	= null;
	oElement._timeout	= fSetTimeout(function() {
		// Create request
		var oSettings	= {};
		oSettings.type	= "GET";
		oSettings.url	= sUrl;
		oSettings.data	= vData || null;
		oSettings.dataType	= "xml";
		oSettings.success	= function(oDocument) {
			// Clear
			fNodeLoader_clear(oElement);
			// Render Content
			fElement_appendChild(oElement, fDocument_importNode(oElement.ownerDocument, oDocument.documentElement, true));
			// Dispatch load event
			var oEvent		= new cEvent;
			oEvent.initEvent("load", false, false);
			fEventTarget_dispatchEvent(oElement, oEvent);
		};
		oSettings.error	= function(oRequest, sMessage) {
			// Dispatch error event
			var oEvent		= new cEvent;
			oEvent.initEvent("error", false, false);
			fEventTarget_dispatchEvent(oElement, oEvent);
		};
		if (fCallback)
			oSettings.complete	= function(oRequest, sStatus) {
				fCallback(oRequest.responseText, sStatus, oRequest);
			};

		// Save in order to be able to cancel
		oElement._request	= fQuery_ajax(oSettings);
		oElement._timeout	= null;
	}, 1);
};

cElement.prototype.$requests	= null;
