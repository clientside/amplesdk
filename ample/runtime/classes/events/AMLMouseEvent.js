/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLMouseEvent	= function(){};
cAMLMouseEvent.prototype	= new cAMLUIEvent;

// nsIDOMMouseEvent
cAMLMouseEvent.prototype.altKey			= null;
cAMLMouseEvent.prototype.button			= null;
cAMLMouseEvent.prototype.clientX		= null;
cAMLMouseEvent.prototype.clientY		= null;
cAMLMouseEvent.prototype.ctrlKey		= null;
cAMLMouseEvent.prototype.metaKey		= null;
cAMLMouseEvent.prototype.relatedTarget	= null;
cAMLMouseEvent.prototype.screenX		= null;
cAMLMouseEvent.prototype.screenY		= null;
cAMLMouseEvent.prototype.shiftKey		= null;

cAMLMouseEvent.prototype.initMouseEvent = function(sType, bCanBubble, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, nButton, oRelatedTarget)
{
/*
	// Validate arguments
	fAML_validate(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	], "initMouseEvent");
*/
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, nDetail);

	this.button		= nButton;
	this.ctrlKey	= bCtrlKey;
	this.altKey		= bAltKey;
	this.metaKey	= bMetaKey;
	this.shiftKey	= bShiftKey;
	this.clientX	= nClientX;
	this.clientY	= nClientY;
	this.screenX	= nScreenX;
	this.screenY	= nScreenY;
	this.relatedTarget	= oRelatedTarget;
};

cAMLMouseEvent.prototype.getModifierState	= function(sModifier)
{
	switch (sModifier) {
		case "Alt":		return this.altKey;
		case "Control":	return this.ctrlKey;
		case "Meta":	return this.metaKey;
		case "Shift":	return this.shiftKey;
	}
	return false;
};
