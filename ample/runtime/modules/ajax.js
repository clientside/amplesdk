/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fAMLQuery_ajax(oSettings) {
	var oRequest	= new cXMLHttpRequest,
		sRequestType	= oSettings.dataType;
	oRequest.open(oSettings.type || "GET", oSettings.url || '.', "async" in oSettings ? oSettings.async : true);
	// Add headers
	oRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	oRequest.setRequestHeader("X-User-Agent", oAMLConfiguration_values["ample-user-agent"]);
	var oHeaders	= oSettings.headers;
	if (!oHeaders)
		oHeaders	= {};
	if (cString(oSettings.type).toUpperCase() == "POST" && !oHeaders["Content-Type"])
		oHeaders["Content-Type"]	= "application/x-www-form-urlencoded";
	for (var sKey in oHeaders)
		if (oHeaders.hasOwnProperty(sKey))
			oRequest.setRequestHeader(sKey, oHeaders[sKey]);
	// Register readystatechange handler
	oRequest.onreadystatechange	= function() {
		if (oRequest.readyState == 4) {
			var nStatus	= oRequest.status,
				sStatus	= "success";
			if (nStatus >= 200 && nStatus <= 300 || nStatus == 304 || nStatus == 1223) {
				var oResponse		= oRequest.responseText,
					sContentType	= oRequest.getResponseHeader("Content-Type"),
					sResponseType	= cString(sContentType).match(/(\w+)\/([-\w]+\+)?(?:x\-)?([-\w]+)?;?(.+)?/) ? cRegExp.$1 : '';
				if (sRequestType != "text") {
					if (sRequestType == "xml" || sResponseType == "xml") {
						oResponse	= fBrowser_getResponseDocument(oRequest);
						if (!oResponse)
							sStatus	= "parsererror";
					}
					else
					if (sRequestType == "json" || sResponseType == "json") {
						try {
							oResponse	= JSON.parse(oResponse);
						}
						catch (oException) {
							sStatus	= "error";
						}
					}
					else
					if (sRequestType == "script" || sResponseType == "javascript" || sResponseType == "ecmascript") {
						try {
							fBrowser_eval(oResponse);
						}
						catch (oException) {
							sStatus	= "error";
						}
					}
				}
			}
			else {
				sStatus	= "error";
			}

			// Call handlers
			if (sStatus == "success") {
				if (oSettings.success)
					oSettings.success(oResponse, sStatus, oRequest);
			}
			else
			if (oSettings.error)
				oSettings.error(oRequest, sStatus);

			// Complete
			if (oSettings.complete)
				oSettings.complete(oRequest, sStatus);
		}
	};
	// Send data
	oRequest.send("data" in oSettings ? oSettings.data : null);

	return oRequest;
};

// ample extensions
oAmple.ajax	= function(oSettings) {
	// Validate API call
	fGuard(arguments, [
		["settings",	cObject]
	]);

	// Invoke implementation
	return fAMLQuery_ajax(oSettings);
};

oAmple.get	= function(sUrl, vData, fCallback, sType) {
	// Validate API call
	fGuard(arguments, [
		["url",		cString],
		["data",	cObject,	true,	true],
		["success",	cFunction,	true],
		["dataType",cString,	true]
	]);

	// Invoke implementation
	var oSettings	= {};
	oSettings.url	= sUrl;
	oSettings.type	= "GET";
	oSettings.data		= vData;
	oSettings.success	= fCallback;
	oSettings.dataType	= sType;

	return fAMLQuery_ajax(oSettings);
};

oAmple.post	= function(sUrl, vData, fCallback, sType) {
	// Validate API call
	fGuard(arguments, [
   		["url",		cString],
		["data",	cObject,	true,	true],
		["success",	cFunction,	true],
		["dataType",cString,	true]
	]);

	// Invoke implementation
	var oSettings	= {};
	oSettings.url	= sUrl;
	oSettings.type	= "POST";
	oSettings.data		= vData;
	oSettings.success	= fCallback;
	oSettings.dataType	= sType;

	return fAMLQuery_ajax(oSettings);
};

// AMLQuery extensions
cAMLQuery.prototype.load	= function(sUrl, vData, fCallback) {
	// Validate API call
	fGuard(arguments, [
		["url",		cString],
		["data",	cObject,	true,	true],
		["success",	cFunction,	true]
	]);

	// Invoke Implementation
	fAMLQuery_each(this, function() {
		fAMLNodeLoader_load(this, sUrl, vData, fCallback);
	});

	return this;
};

cAMLQuery.prototype.abort	= function() {
	// Invoke Implementation
	fAMLQuery_each(this, function() {
		fAMLNodeLoader_abort(this);
	});

	return this;
};
