/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cMouseEvent	= function(){};
cMouseEvent.prototype	= new cUIEvent;
cMouseEvent.prototype.eventInterface	= "MouseEvent";

// nsIDOMMouseEvent
cMouseEvent.prototype.altKey		= null;
cMouseEvent.prototype.button		= null;
cMouseEvent.prototype.clientX		= null;
cMouseEvent.prototype.clientY		= null;
cMouseEvent.prototype.ctrlKey		= null;
cMouseEvent.prototype.metaKey		= null;
cMouseEvent.prototype.relatedTarget	= null;
cMouseEvent.prototype.screenX		= null;
cMouseEvent.prototype.screenY		= null;
cMouseEvent.prototype.shiftKey		= null;

cMouseEvent.prototype.initMouseEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, nButton, oRelatedTarget) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
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

cMouseEvent.prototype.getModifierState	= function(sModifier) {
	switch (sModifier) {
		case "Alt":		return this.altKey;
		case "Control":	return this.ctrlKey;
		case "Meta":	return this.metaKey;
		case "Shift":	return this.shiftKey;
	}
	return false;
};
