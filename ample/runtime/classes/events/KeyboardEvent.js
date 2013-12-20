/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cKeyboardEvent	= function(sType) {
	fKeyboardEvent_init(this, sType, arguments[1]);
};
cKeyboardEvent.prototype	= new cUIEvent('#' + "KeyboardEvent");

// Constants
cKeyboardEvent.DOM_KEY_LOCATION_STANDARD	= 0;
cKeyboardEvent.DOM_KEY_LOCATION_LEFT		= 1;
cKeyboardEvent.DOM_KEY_LOCATION_RIGHT		= 2;
cKeyboardEvent.DOM_KEY_LOCATION_NUMPAD		= 3;

// Public Properties
cKeyboardEvent.prototype.key		= null;
cKeyboardEvent.prototype.location	= null;
cKeyboardEvent.prototype.ctrlKey	= null;
cKeyboardEvent.prototype.shiftKey	= null;
cKeyboardEvent.prototype.altKey		= null;
cKeyboardEvent.prototype.metaKey	= null;
cKeyboardEvent.prototype.repeat		= null;

function fKeyboardEvent_getDictionary(bBubbles, bCancelable, oView, nDetail, sKey, nLocation, sModifiersList, bRepeat) {
	var oValue	= fUIEvent_getDictionary(bBubbles, bCancelable, oView, nDetail);
	//
	oValue.key		= sKey;
	oValue.location	= nLocation;

	oValue.ctrlKey	= sModifiersList.indexOf("Control") >-1;
	oValue.shiftKey	= sModifiersList.indexOf("Shift") >-1;
	oValue.altKey	= sModifiersList.indexOf("Alt") >-1;
	oValue.metaKey	= sModifiersList.indexOf("Meta") >-1;

	oValue.repeat	= bRepeat;

	return oValue;
};

function fKeyboardEvent_init(oEvent, sType, oValue) {
	fUIEvent_init(oEvent, sType, oValue);
	//
	if (oValue) {
		if ("key" in oValue)
			oEvent.key	= oValue.key;
		if ("location" in oValue)
			oEvent.location	= oValue.location;
		if ("ctrlKey" in oValue)
			oEvent.ctrlKey	= oValue.ctrlKey;
		if ("shiftKey" in oValue)
			oEvent.shiftKey	= oValue.shiftKey;
		if ("altKey" in oValue)
			oEvent.altKey	= oValue.altKey;
		if ("metaKey" in oValue)
			oEvent.metaKey	= oValue.metaKey;
		if ("repeat" in oValue)
			oEvent.repeat	= oValue.repeat;
	}
};

// Public Methods
cKeyboardEvent.prototype.initKeyboardEvent	= function(sType, bBubbles, bCancelable, oView, nDetail, sKey, nLocation, sModifiersList, bRepeat) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["bubbles",		cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	fKeyboardEvent_init(this, sType, fKeyboardEvent_getDictionary(bBubbles, bCancelable, oView, nDetail, sKey, nLocation, sModifiersList, bRepeat));
};

cKeyboardEvent.prototype.getModifierState	= function(sModifier) {
	switch (sModifier) {
		case "Control":	return this.ctrlKey;
		case "Shift":	return this.shiftKey;
		case "Alt":		return this.altKey;
		case "Meta":	return this.metaKey;
	}
	return false;
};
