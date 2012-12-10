/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fQuery_ajax(oSettings) {
	var oRequest	= new cXMLHttpRequest,
		oHeaders	= oSettings.headers || {},
		sRequestContentType	= oHeaders["Content-Type"] || '',
		sExpectedDataType	= oSettings.dataType,
		sUrl	= oSettings.url || '.',
		sType	= "type" in oSettings ? cString(oSettings.type).toUpperCase() : "GET",
		bAsync	= "async" in oSettings ? oSettings.async : true,
		vData	= "data" in oSettings ? oSettings.data : null,
		nRequestTimeout;
	//
	if (vData != null) {
		if (typeof vData == "object" && !("ownerDocument" in vData))
			vData	= fQuery_param(vData);
		//
		if (sType == "POST") {
			if (!sRequestContentType && typeof vData == "string")
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
	oRequest.setRequestHeader("X-User-Agent", oDOMConfiguration_values["ample-user-agent"]);
	for (var sKey in oHeaders)
		if (oHeaders.hasOwnProperty(sKey))
			oRequest.setRequestHeader(sKey, oHeaders[sKey]);
	// Register readystatechange handler
	var fOnReadStateChange	=
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
					sResponseContentType= oRequest.getResponseHeader("Content-Type") || '',
					sResponseDataType	= sResponseContentType.match(/(\w+)\/([-\w]+\+)?(?:x\-)?([-\w]+)?;?(.+)?/) ? cRegExp.$3 : '';
				if (sExpectedDataType != "text") {
					if (sExpectedDataType == "xml" || sResponseDataType == "xml") {
						oResponse	= fBrowser_getResponseDocument(oRequest);
						if (!oResponse) {
							sStatus	= "parsererror";
//->Debug
							fUtilities_warn(sGUARD_XML_SYNTAX_WRN);
//<-Debug
						}
					}
					else
					if (sExpectedDataType == "json" || sResponseDataType == "json") {
						try {
							oResponse	= oJSON.parse(oResponse);
						}
						catch (oException) {
							sStatus	= "parsererror";
//->Debug
							fUtilities_warn(sGUARD_JSON_SYNTAX_WRN, [oException.message]);
//<-Debug
						}
					}
					else
					if (sExpectedDataType == "script" || sResponseDataType == "javascript" || sResponseDataType == "ecmascript") {
						try {
							fBrowser_eval(oResponse);
						}
						catch (oException) {
							sStatus	= "error";
//->Debug
							fUtilities_warn(sGUARD_JAVASCRIPT_SYNTAX_WRN, [oException.message]);
//<-Debug
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

	// Fix Gecko bug with onreadystatechange not firing, happens for example in 3.6
	if (!bAsync && bGecko && nVersion < 2)
		fOnReadStateChange();

	return oRequest;
};

function fQuery_param(vValue) {
	var aValue	= [];
	if (vValue instanceof cNodeList) {
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
	}
	else
	if (vValue instanceof cObject) {
		(function(sPrefix, vValue) {
			if (vValue instanceof cArray)
				for (var nIndex = 0, nLength = vValue.length, oValue; nIndex < nLength; nIndex++)
					arguments.callee(sPrefix + '[' + ((oValue = vValue[nIndex]) instanceof cArray || typeof oValue == "object" ? nIndex : '') + ']', oValue);
			else
			if (vValue instanceof cObject)
				for (var sKey in vValue)
					arguments.callee(sPrefix + (sPrefix == '' ? sKey : '[' + sKey + ']'), vValue[sKey]);
			else
				aValue[aValue.length]	= fEncodeURIComponent(sPrefix) + '=' + fEncodeURIComponent(vValue);
		})('', vValue);
	}
	else
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
	//
	return aValue.join('&').replace(/%20/g, '+');
};

// ample extensions
oAmple.ajax	= function(oSettings) {
//->Guard
	fGuard(arguments, [
		["settings",	cObject]
	]);
//<-Guard

	return fQuery_ajax(oSettings);
};

oAmple.param	= function(vValue) {
//->Guard
	fGuard(arguments, [
		["value",	cObject]
	]);
//<-Guard

	return fQuery_param(vValue);
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

	return fQuery_ajax(oSettings);
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

	return fQuery_ajax(oSettings);
};

// Query extensions
cQuery.prototype.load	= function(sUrl, vData, fCallback) {
//->Guard
	fGuard(arguments, [
		["url",		cString],
		["data",	cObject,	true,	true],
		["complete",cFunction,	true]
	]);
//<-Guard

	return fQuery_each(this, function() {
		fNodeLoader_load(this, sUrl, vData, fCallback);
	});
};

cQuery.prototype.abort	= function() {
	return fQuery_each(this, function() {
		fNodeLoader_abort(this);
	});
};
