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
		oHeaders	= oSettings.headers || {},
		sRequestType= oSettings.dataType,
		sUrl	= oSettings.url || '.',
		sType	= "type" in oSettings ? cString(oSettings.type).toUpperCase() : "GET",
		bAsync	= "async" in oSettings ? oSettings.async : true,
		vData	= "data" in oSettings ? oSettings.data : null,
		nRequestTimeout;
	//
	if (vData != null) {
		if (typeof vData == "object" && !("ownerDocument" in vData))
			vData	= fAMLQuery_param(vData);
		if (sType == "POST") {
			if (!oHeaders["Content-Type"] && typeof vData == "string")
				oHeaders["Content-Type"]	= "application/x-www-form-urlencoded";
		}
		else {
			sUrl	+=(sUrl.indexOf('?') ==-1 ? '?' : '&')+ vData;
			vData	= null;
		}
	}
	// Open connection
	oRequest.open(sType, sUrl, bAsync);
	// Set headers
	oRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	oRequest.setRequestHeader("X-User-Agent", oAMLConfiguration_values["ample-user-agent"]);
	for (var sKey in oHeaders)
		if (oHeaders.hasOwnProperty(sKey))
			oRequest.setRequestHeader(sKey, oHeaders[sKey]);
	// Register readystatechange handler
	oRequest.onreadystatechange	= function() {
		if (oRequest.readyState == 4) {
			// Clear timeout
			if (nRequestTimeout)
				fClearTimeout(nRequestTimeout);
			//
			var nStatus	= oRequest.status,
				sStatus	= "success";
			if (nStatus >= 200 && nStatus <= 300 || nStatus == 304 || nStatus == 1223) {
				var oResponse		= oRequest.responseText,
					sContentType	= oRequest.getResponseHeader("Content-Type"),
					sResponseType	= cString(sContentType).match(/(\w+)\/([-\w]+\+)?(?:x\-)?([-\w]+)?;?(.+)?/) ? cRegExp.$3 : '';
				if (sRequestType != "text") {
					if (sRequestType == "xml" || sResponseType == "xml") {
						oResponse	= fBrowser_getResponseDocument(oRequest);
						if (!oResponse)
							sStatus	= "parsererror";
					}
					else
					if (sRequestType == "json" || sResponseType == "json") {
						try {
							oResponse	= oJSON.parse(oResponse);
						}
						catch (oException) {
							sStatus	= "parsererror";
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
	// Set timeout
	if (bAsync && !fIsNaN(oSettings.timeout))
		nRequestTimeout	= fSetTimeout(function() {
			// remove handler
			oRequest.onreadystatechange	= new cFunction;
			oRequest.abort();
			// Error
			if (oSettings.error)
				oSettings.error(oRequest, "timeout");
			// Complete
			if (oSettings.complete)
				oSettings.complete(oRequest, "timeout");
		}, oSettings.timeout);
	// Send data
	oRequest.send(vData);

	return oRequest;
};

function fAMLQuery_param(vValue) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// ample extensions
oAmple.ajax	= function(oSettings) {
//->Guard
	fGuard(arguments, [
		["settings",	cObject]
	]);
//<-Guard

	return fAMLQuery_ajax(oSettings);
};

oAmple.param	= function(vValue) {
//->Guard
	fGuard(arguments, [
		["value",	cObject]
	]);
//<-Guard

	return fAMLQuery_param(vValue);
};

oAmple.get	= function(sUrl, vData, fCallback, sType) {
//->Guard
	fGuard(arguments, [
		["url",		cString],
		["data",	cObject,	true,	true],
		["success",	cFunction,	true],
		["dataType",cString,	true]
	]);
//<-Guard

	var oSettings	= {};
	oSettings.url	= sUrl;
	oSettings.type	= "GET";
	oSettings.data		= vData;
	oSettings.success	= fCallback;
	oSettings.dataType	= sType;

	return fAMLQuery_ajax(oSettings);
};

oAmple.post	= function(sUrl, vData, fCallback, sType) {
//->Guard
	fGuard(arguments, [
   		["url",		cString],
		["data",	cObject,	true,	true],
		["success",	cFunction,	true],
		["dataType",cString,	true]
	]);
//<-Guard

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
//->Guard
	fGuard(arguments, [
		["url",		cString],
		["data",	cObject,	true,	true],
		["success",	cFunction,	true]
	]);
//<-Guard

	fAMLQuery_each(this, function() {
		fAMLNodeLoader_load(this, sUrl, vData, fCallback);
	});

	return this;
};

cAMLQuery.prototype.abort	= function() {
	fAMLQuery_each(this, function() {
		fAMLNodeLoader_abort(this);
	});

	return this;
};
