/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLKeyboardEvent	= function(){};
cAMLKeyboardEvent.prototype	= new cAMLUIEvent;

// Constants
cAMLKeyboardEvent.DOM_KEY_LOCATION_STANDARD = 0;
cAMLKeyboardEvent.DOM_KEY_LOCATION_LEFT     = 1;
cAMLKeyboardEvent.DOM_KEY_LOCATION_RIGHT    = 2;
cAMLKeyboardEvent.DOM_KEY_LOCATION_NUMPAD   = 3;

// Public Properties
cAMLKeyboardEvent.prototype.keyIdentifier = null;
cAMLKeyboardEvent.prototype.keyLocation   = null;
cAMLKeyboardEvent.prototype.altKey   = null;
cAMLKeyboardEvent.prototype.ctrlKey  = null;
cAMLKeyboardEvent.prototype.metaKey  = null;
cAMLKeyboardEvent.prototype.shiftKey = null;

// Public Methods
cAMLKeyboardEvent.prototype.initKeyboardEvent	= function(sType, bCanBubble, bCancelable, oView, sKeyIdentifier, nKeyLocation, sModifiersList) {
/*
	// Validate arguments
	fAML_validate(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	], "initKeyboardEvent");
*/
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, null);

	//
	this.ctrlKey  = sModifiersList.indexOf("Control") >-1;
	this.altKey   = sModifiersList.indexOf("Alt")     >-1;
	this.shiftKey = sModifiersList.indexOf("Shift")   >-1;
	this.metaKey  = sModifiersList.indexOf("Meta")    >-1;

	this.keyIdentifier = sKeyIdentifier;
	this.keyLocation   = nKeyLocation;
};

cAMLKeyboardEvent.prototype.getModifierState = function(sModifier) {
	switch (sModifier) {
		case "Alt":		return this.altKey;
		case "Control":	return this.ctrlKey;
		case "Meta":	return this.metaKey;
		case "Shift":	return this.shiftKey;
	}
	return false;
};
