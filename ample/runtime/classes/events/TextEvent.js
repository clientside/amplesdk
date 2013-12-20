/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cTextEvent	= function(sType) {
	fTextEvent_init(this, sType, arguments[1]);
};
cTextEvent.prototype	= new cUIEvent('#' + "TextEvent");

// nsIDOMTextEvent
cTextEvent.DOM_INPUT_METHOD_UNKNOWN		= 0;
cTextEvent.DOM_INPUT_METHOD_KEYBOARD	= 1;
cTextEvent.DOM_INPUT_METHOD_PASTE		= 2;
cTextEvent.DOM_INPUT_METHOD_DROP		= 3;
cTextEvent.DOM_INPUT_METHOD_IME			= 4;
cTextEvent.DOM_INPUT_METHOD_OPTION		= 5;
cTextEvent.DOM_INPUT_METHOD_HANDWRITING	= 6;
cTextEvent.DOM_INPUT_METHOD_VOICE		= 7;
cTextEvent.DOM_INPUT_METHOD_MULTIMODAL	= 8;
cTextEvent.DOM_INPUT_METHOD_SCRIPT		= 9;

cTextEvent.prototype.data	= null;
cTextEvent.prototype.inputMethod	= null;
cTextEvent.prototype.locale	= null;

function fTextEvent_getDictionary(bBubbles, bCancelable, oView, sData, nInputMethod, sLocale) {
	var oValue	= fUIEvent_getDictionary(bBubbles, bCancelable, oView, 0);
	//
	oValue.data		= sData;
	oValue.inputMethod	= nInputMethod;
	oValue.locale	= sLocale;

	return oValue;
};

function fTextEvent_init(oEvent, sType, oValue) {
	fUIEvent_init(oEvent, sType, oValue);
	//
	if (oValue) {
		if ("data" in oValue)
			oEvent.data	= oValue.data;
		if ("inputMethod" in oValue)
			oEvent.inputMethod	= oValue.inputMethod;
		if ("locale" in oValue)
			oEvent.locale	= oValue.locale;
	}
};

//
cTextEvent.prototype.initTextEvent	= function(sType, bBubbles, bCancelable, oView, sData, nInputMethod, sLocale) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	fTextEvent_init(this, sType, fTextEvent_getDictionary(bBubbles, bCancelable, oView, sData, nInputMethod, sLocale));
};
