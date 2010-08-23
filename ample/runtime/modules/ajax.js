/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

oAmple.ajax	= function(oSettings) {
	// Validate API call
	fGuard(arguments, [
		["settings",	cObject]
	]);

	var oRequest	= new cXMLHttpRequest;
	oRequest.open(oSettings.type || "GET", oSettings.url || '', "async" in oSettings ? oSettings.async : true);
	oRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	oRequest.setRequestHeader("X-User-Agent", oAMLConfiguration_values["ample-user-agent"]);
	var oHeaders	= oSettings.headers;
	if (oHeaders)
		for (var sKey in oHeaders)
			oRequest.setRequestHeader(sKey, oHeaders[sKey]);
	oRequest.onreadystatechange	= function() {
		if (oRequest.readyState == 4) {
			if (oSettings.complete)
				oSettings.complete(oRequest, oRequest.textStatus);
		}
	};
	oRequest.send("data" in oSettings ? oSettings.data : null);

	// Invoke implementation
	return oRequest;
};

oAmple.get	= function(sUrl, /*data*/vArgument2, /*success*/vArgument3, /*type*/vArgument4) {
	// Validate API call
	fGuard(arguments, [
		["url",	cString]
	]);

	// Invoke implementation
	var oSettings	= {};
	oSettings.url	= sUrl;
	oSettings.type	= "GET";
	oSettings.data		= vArgument2;
	oSettings.success	= vArgument3;
	oSettings.dataType	= vArgument4;

	return oAmple.ajax(oSettings);
};

oAmple.post	= function(sUrl, /*data*/vArgument2, /*success*/vArgument3, /*type*/vArgument4) {
	// Validate API call
	fGuard(arguments, [
		["url",	cString]
	]);

	// Invoke implementation
	var oSettings	= {};
	oSettings.url	= sUrl;
	oSettings.type	= "POST";
	oSettings.data		= vArgument2;
	oSettings.success	= vArgument3;
	oSettings.dataType	= vArgument4;

	return oAmple.ajax(oSettings);
};

// Content Loader
function fAMLQuery_load_clear(oElement)
{
	if (oElement._request)
	    delete oElement._request;
	if (oElement._timeout) {
		fClearTimeout(oElement._timeout);
		delete oElement._timeout;
	}
};

function fAMLQuery_load_abort(oElement)
{
	if (oElement._timeout || oElement._request) {
		if (oElement._request)
			oElement._request	= oElement._request.abort();
		fAMLQuery_load_clear(oElement);

		// Dispatch abort event
		var oEvent	= new cAMLEvent;
		oEvent.initEvent("abort", false, false);
		fAMLNode_dispatchEvent(oElement, oEvent);
	}
};

cAMLQuery.prototype.load	= function(sUrl, /*data*/vArgument2, /*success*/vArgument3) {
	// Validate API call
	fGuard(arguments, [
		["url",	cString]
	]);

	// Invoke Implementation
	if (this.length) {
		var oElement	= this[0];
		// If there is an operation running, abort it
		fAMLQuery_load_abort(oElement);

		// Dispatch unload event
		var oEvent	= new cAMLEvent;
		oEvent.initEvent("unload", false, false);
		fAMLNode_dispatchEvent(oElement, oEvent);

		// Remove nodes
		while (oElement.lastChild)
			fAMLElement_removeChild(oElement, oElement.lastChild);

		// Do timeout before loading
		oElement._request	= null;
		oElement._timeout	= fSetTimeout(function() {
			// Create request
			var oSettings	= {};
			oSettings.type	= "GET";
			oSettings.url	= sUrl;
			oSettings.data	= vArgument2 || null;
			oSettings.complete	= function(oRequest) {
				// Clear
				fAMLQuery_load_clear(oElement);

			    var oDocument	= fBrowser_getResponseDocument(oRequest),
					oEvent		= new cAMLEvent;
			    if (oDocument) {
					// Render Content
			    	fAMLElement_appendChild(oElement, fAMLDocument_importNode(oElement.ownerDocument, oDocument.documentElement, true));
					// Initialize event
					oEvent.initEvent("load", false, false);
			    }
			    else {
//->Debug
					fUtilities_warn(sAML_NOT_WELLFORMED_WRN);
//<-Debug
					// Initialize event
					oEvent.initEvent("error", false, false);
			    }
				// Dispatch event
				fAMLNode_dispatchEvent(oElement, oEvent);
			};

			// Save in order to be able to cancel
			oElement._request	= oAmple.ajax(oSettings);
			oElement._timeout	= null;
		}, 1);
	}

	return this;
};

cAMLQuery.prototype.abort	= function() {
	if (this.length)
		fAMLQuery_load_abort(this[0]);
	return this;
};
