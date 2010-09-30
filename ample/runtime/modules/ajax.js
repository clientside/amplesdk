/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fAMLQuery_ajax(oSettings) {
	var oRequest	= new cXMLHttpRequest;
	oRequest.open(oSettings.type || "GET", oSettings.url || '.', "async" in oSettings ? oSettings.async : true);
	// Add headers
	oRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	oRequest.setRequestHeader("X-User-Agent", oAMLConfiguration_values["ample-user-agent"]);
	var oHeaders	= oSettings.headers;
	if (oHeaders)
		for (var sKey in oHeaders)
			oRequest.setRequestHeader(sKey, oHeaders[sKey]);
	// Register readystatechange handler
	oRequest.onreadystatechange	= function() {
		if (oRequest.readyState == 4) {
			if (oSettings.complete)
				oSettings.complete(oRequest, oRequest.textStatus);
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
		["data",	cObject,	true,	null],
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
		["data",	cObject,	true,	null],
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
		["data",	cObject,	true,	null],
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
