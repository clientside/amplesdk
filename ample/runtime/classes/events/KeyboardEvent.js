/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cKeyboardEvent	= function(){};
cKeyboardEvent.prototype	= new cUIEvent;
cKeyboardEvent.prototype.eventInterface	= "KeyboardEvent";

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

// Public Methods
cKeyboardEvent.prototype.initKeyboardEvent	= function(sType, bCanBubble, bCancelable, oView, sKeyIdentifier, nKeyLocation, sModifiersList) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, null);

	//
	this.ctrlKey	= sModifiersList.indexOf("Control") >-1;
	this.altKey		= sModifiersList.indexOf("Alt") >-1;
	this.shiftKey	= sModifiersList.indexOf("Shift") >-1;
	this.metaKey	= sModifiersList.indexOf("Meta") >-1;

	this.keyIdentifier	= sKeyIdentifier;
	this.keyLocation	= nKeyLocation;
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
