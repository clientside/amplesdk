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
cKeyboardEvent.prototype.keyIdentifier	= null;
cKeyboardEvent.prototype.keyLocation	= null;
cKeyboardEvent.prototype.altKey		= null;
cKeyboardEvent.prototype.ctrlKey	= null;
cKeyboardEvent.prototype.metaKey	= null;
cKeyboardEvent.prototype.shiftKey	= null;

function fKeyboardEvent_getDictionary(bBubbles, bCancelable, oView, sKeyIdentifier, nKeyLocation, sModifiersList) {
	var oValue	= fUIEvent_getDictionary(bBubbles, bCancelable, oView, 0);
	//
	oValue.ctrlKey	= sModifiersList.indexOf("Control") >-1;
	oValue.altKey	= sModifiersList.indexOf("Alt") >-1;
	oValue.shiftKey	= sModifiersList.indexOf("Shift") >-1;
	oValue.metaKey	= sModifiersList.indexOf("Meta") >-1;

	oValue.keyIdentifier	= sKeyIdentifier;
	oValue.keyLocation		= nKeyLocation;

	return oValue;
};

function fKeyboardEvent_init(oEvent, sType, oValue) {
	fUIEvent_init(oEvent, sType, oValue);
	//
	if (oValue) {
		if ("keyIdentifier" in oValue)
			oEvent.keyIdentifier	= oValue.keyIdentifier;
		if ("keyLocation" in oValue)
			oEvent.keyLocation	= oValue.keyLocation;
		if ("ctrlKey" in oValue)
			oEvent.ctrlKey	= oValue.ctrlKey;
		if ("shiftKey" in oValue)
			oEvent.shiftKey	= oValue.shiftKey;
		if ("altKey" in oValue)
			oEvent.altKey	= oValue.altKey;
		if ("metaKey" in oValue)
			oEvent.metaKey	= oValue.metaKey;
	}
};

// Public Methods
cKeyboardEvent.prototype.initKeyboardEvent	= function(sType, bBubbles, bCancelable, oView, sKeyIdentifier, nKeyLocation, sModifiersList) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	fKeyboardEvent_init(this, sType, fKeyboardEvent_getDictionary(bBubbles, bCancelable, oView, sKeyIdentifier, nKeyLocation, sModifiersList));
};

cKeyboardEvent.prototype.getModifierState	= function(sModifier) {
	switch (sModifier) {
		case "Alt":		return this.altKey;
		case "Control":	return this.ctrlKey;
		case "Meta":	return this.metaKey;
		case "Shift":	return this.shiftKey;
	}
	return false;
};
