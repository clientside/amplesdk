/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Content Loader
function fAMLNodeLoader_clear(oElement)
{
	if (oElement._request)
	    delete oElement._request;
	if (oElement._timeout) {
		fClearTimeout(oElement._timeout);
		delete oElement._timeout;
	}
	// Remove "load" pseudo-class
	fAMLElement_setPseudoClass(oElement, "load", false);
};

function fAMLNodeLoader_abort(oElement)
{
	if (oElement._timeout || oElement._request) {
		if (oElement._request)
			oElement._request	= oElement._request.abort();
		fAMLNodeLoader_clear(oElement);

		// Dispatch abort event
		var oEvent	= new cAMLEvent;
		oEvent.initEvent("abort", false, false);
		fAMLNode_dispatchEvent(oElement, oEvent);
	}
};

function fAMLNodeLoader_load(oElement, sUrl, vData, fCallback) {
	// If there is an operation running, abort it
	fAMLNodeLoader_abort(oElement);

	// Dispatch unload event
	var oEvent	= new cAMLEvent;
	oEvent.initEvent("unload", false, false);
	fAMLNode_dispatchEvent(oElement, oEvent);

	// Remove nodes
	while (oElement.lastChild)
		fAMLElement_removeChild(oElement, oElement.lastChild);

	// Set "load" pseudo-class
	fAMLElement_setPseudoClass(oElement, "load", true);

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
			fAMLNodeLoader_clear(oElement);
			// Render Content
	    	fAMLElement_appendChild(oElement, fAMLDocument_importNode(oElement.ownerDocument, oDocument.documentElement, true));
			// Dispatch load event
		    var oEvent		= new cAMLEvent;
			oEvent.initEvent("load", false, false);
			fAMLNode_dispatchEvent(oElement, oEvent);
		};
		oSettings.error	= function(oRequest, sMessage) {
//->Debug
			if (sMessage == "parsererror")
				fUtilities_warn(sAML_NOT_WELLFORMED_WRN);
//<-Debug
			// Dispatch error event
		    var oEvent		= new cAMLEvent;
			oEvent.initEvent("error", false, false);
			fAMLNode_dispatchEvent(oElement, oEvent);
		};

		// Save in order to be able to cancel
		oElement._request	= fAMLQuery_ajax(oSettings);
		oElement._timeout	= null;
	}, 1);
};

cAMLElement.prototype.$requests	= null;
