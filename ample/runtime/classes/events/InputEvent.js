/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cInputEvent	= function(sType) {
	fInputEvent_init(this, sType, arguments[1]);
};
cInputEvent.prototype	= new cEvent('#' + "InputEvent");

cInputEvent.prototype.data	= null;

function fInputEvent_getDictionary(bBubbles, bCancelable, sData) {
	var oValue	= fEvent_getDictionary(bBubbles, bCancelable);
	//
	oValue.data		= sData;

	return oValue;
};

function fInputEvent_init(oEvent, sType, oValue) {
	fEvent_init(oEvent, sType, oValue);
	//
	if (oValue) {
		if ("data" in oValue)
			oEvent.data	= oValue.data;
	}
};

//
cInputEvent.prototype.initInputEvent	= function(sType, bBubbles, bCancelable, sData) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["bubbles",		cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	fInputEvent_init(this, sType, fInputEvent_getDictionary(bBubbles, bCancelable, sData));
};
