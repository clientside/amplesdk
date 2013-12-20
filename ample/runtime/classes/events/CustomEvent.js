/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cCustomEvent	= function(sType) {
	fCustomEvent_init(this, sType, arguments[1]);
};
cCustomEvent.prototype	= new cEvent('#' + "CustomEvent");

// nsIDOMCustomEvent
cCustomEvent.prototype.detail	= null;

function fCustomEvent_getDictionary(bBubbles, bCancelable, oDetail) {
	var oValue	= fEvent_getDictionary(bBubbles, bCancelable);
	//
	oValue.detail	= oDetail;

	return oValue;
};

function fCustomEvent_init(oEvent, sType, oValue) {
	fEvent_init(oEvent, sType, oValue);
	//
	if (oValue) {
		if ("detail" in oValue)
			oEvent.detail	= oValue.detail;
	}
};

//
cCustomEvent.prototype.initCustomEvent	= function(sType, bBubbles, bCancelable, oDetail) {
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["bubbles",		cBoolean],
		["cancelable",	cBoolean],
		["detail",		cObject,	false, true]
	]);
//<-Guard

	fCustomEvent_init(this, sType, fCustomEvent_getDictionary(bBubbles, bCancelable, oDetail));
};
