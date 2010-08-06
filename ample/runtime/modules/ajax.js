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
	oRequest.onreadystatechange	= function() {
		if (oRequest.readyState == 4) {

		}
	}
	oRequest.send("data" in oSettings.data ? oSettings.data : null);

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

cAMLQuery.prototype.load	= function(sUrl, /*data*/vArgument2, /*success*/vArgument3) {
	// Validate API call
	fGuard(arguments, [
		["url",	cString]
	]);

	if (this.length) {
		var oSettings	= {};
		oSettings.type	= "GET";
		oSettings.data	= vArgument2;
		oSettings.success	= function(sText, sStatus, oRequest) {

		};
		// Execute request
		oQuery.ajax(oSettings);
	}

	// Invoke implementation
	return this;
};