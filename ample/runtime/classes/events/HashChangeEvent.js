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
	this.type	= sType;
	// Initializer
	if (arguments.length > 1)
		fHashChangeEvent_init(this, arguments[1]);
};
cHashChangeEvent.prototype	= new cEvent('#' + "HashChangeEvent");
//
cHashChangeEvent.prototype.oldURL	= null;
cHashChangeEvent.prototype.newURL	= null;

function fHashChangeEvent_getDictionary(sType, bBubbles, bCancelable, sOldUrl, sNewUrl) {
	var oValue	= fEvent_getDictionary(sType, bBubbles, bCancelable);
	//
	oValue.oldURL	= sOldUrl;
	oValue.newURL	= sNewUrl;

	return oValue;
};

function fHashChangeEvent_init(oEvent, oValue) {
	fEvent_init(oEvent, oValue);
	//
	if ("oldURL" in oValue)
		oEvent.oldURL	= oValue.oldURL;
	if ("newURL" in oValue)
		oEvent.newURL	= oValue.newURL;
};

cHashChangeEvent.prototype.initHashChangeEvent	= function(sType, bBubbles, bCancelable, sOldUrl, sNewUrl) {
	fHashChangeEvent_init(this, fHashChangeEvent_getDictionary(sType, bBubbles, bCancelable, sOldUrl, sNewUrl));
};
