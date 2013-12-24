/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var sAmple_include	= oUALocation.href;
fRequire	= function(sSrc) {
//->Guard
	fGuard(arguments, [
		["src",	cString]
	]);
//<-Guard

	var sValue	= sAmple_include;
	// Save current location
	sAmple_include	= fUtilities_resolveUri(sSrc, sValue);
	//
	var oRequest	= fBrowser_load(sAmple_include, "text/javascript");
	// Evaluate result
	fBrowser_eval(oRequest.responseText);
	// Restore base location
	sAmple_include	= sValue;
};
