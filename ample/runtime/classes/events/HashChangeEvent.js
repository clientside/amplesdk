/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
var cHashChangeEvent	= function(sType) {
	fHashChangeEvent_init(this, sType, arguments[1]);
};
cHashChangeEvent.prototype	= new cEvent('#' + "HashChangeEvent");
//
cHashChangeEvent.prototype.oldURL	= null;
cHashChangeEvent.prototype.newURL	= null;

function fHashChangeEvent_getDictionary(bBubbles, bCancelable, sOldUrl, sNewUrl) {
	var oValue	= fEvent_getDictionary(bBubbles, bCancelable);
	//
	oValue.oldURL	= sOldUrl;
	oValue.newURL	= sNewUrl;

	return oValue;
};

function fHashChangeEvent_init(oEvent, sType, oValue) {
	fEvent_init(oEvent, sType, oValue);
	//
	if (oValue) {
		if ("oldURL" in oValue)
			oEvent.oldURL	= oValue.oldURL;
		if ("newURL" in oValue)
			oEvent.newURL	= oValue.newURL;
	}
};

cHashChangeEvent.prototype.initHashChangeEvent	= function(sType, bBubbles, bCancelable, sOldUrl, sNewUrl) {
	fHashChangeEvent_init(this, sType, fHashChangeEvent_getDictionary(bBubbles, bCancelable, sOldUrl, sNewUrl));
};
