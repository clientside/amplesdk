/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Private members
function fAmple_setCookie(oAmple, sName, vValue, oSettings) {
	if (vValue == null) {
		oSettings.expires	=-1;
		vValue	= '';
	}
	document.cookie	= sName + '=' + encodeURIComponent(vValue) +
									(oSettings.expires	? '; expires=' + (oSettings.expires instanceof Date ? oSettings.expires : new Date(new Date().getTime() + Number(oSettings.expires) * 864e5)).toUTCString() : '') +
									(oSettings.path		? '; path=' + oSettings.path : '') +
									(oSettings.domain	? '; domain=' + oSettings.domain : '') +
									(oSettings.secure	? '; secure' : '');
};

function fAmple_getCookie(oAmple, sName) {
	var oCookie	= document.cookie;
	if (oCookie && oCookie != '') {
		for (var nIndex = 0, aCookie = oCookie.split(';'), nLength = aCookie.length; nIndex < nLength; nIndex++)
			if (aCookie[nIndex].match(/^\s*([^=]+)=(.*)\s*/) && RegExp.$1 == sName)
				return decodeURIComponent(RegExp.$2);
	}
	return null;
};

// Extend ample object
ample.extend({
	//
	cookie:	function(sName, vValue, oSettings) {
		// Validate API call
		ample.guard(arguments, [
			["name",	String],
			["value",	Object, true, true],
			["settings",Object,	true]
		]);

		if (arguments.length > 1)
			fAmple_setCookie(this, sName, vValue, oSettings || {});
		else
			return fAmple_getCookie(this, sName);
	}
});