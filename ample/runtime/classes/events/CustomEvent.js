/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cCustomEvent	= function(sType) {
	this.type	= sType;
	// Initializer
	if (arguments.length > 1)
		fCustomEvent_init(this, arguments[1]);
};
cCustomEvent.prototype	= new cEvent('#' + "CustomEvent");

// nsIDOMCustomEvent
cCustomEvent.prototype.detail	= null;

function fCustomEvent_getDictionary(sType, bBubbles, bCancelable, oDetail) {
	var oValue	= fEvent_getDictionary(sType, bBubbles, bCancelable);
	//
	oValue.detail	= oDetail;

	return oValue;
};

function fCustomEvent_init(oEvent, oValue) {
	fEvent_init(oEvent, oValue);
	//
	if ("detail" in oValue)
		oEvent.detail	= oValue.detail;
};

//
cCustomEvent.prototype.initCustomEvent	= function(sType, bBubbles, bCancelable, oDetail) {
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean],
		["detail",		cObject,	false, true]
	]);
//<-Guard

	fCustomEvent_init(this, fCustomEvent_getDictionary(sType, bBubbles, bCancelable, oDetail));
};
