/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cMouseEvent	= function(sType) {
	this.type	= sType;
	// Initializer
	if (arguments.length > 1)
		fMouseEvent_init(this, arguments[1]);
};
cMouseEvent.prototype	= new cUIEvent('#' + "MouseEvent");

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

function fMouseEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, nButton, oRelatedTarget) {
	var oValue	= fUIEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail);
	//
	oValue.screenX	= nScreenX;
	oValue.screenY	= nScreenY;
	oValue.clientX	= nClientX;
	oValue.clientY	= nClientY;
	oValue.ctrlKey	= bCtrlKey;
	oValue.altKey	= bAltKey;
	oValue.shiftKey	= bShiftKey;
	oValue.metaKey	= bMetaKey;
	oValue.button	= nButton;
	oValue.relatedTarget	= oRelatedTarget;

	return oValue;
};

function fMouseEvent_init(oEvent, oValue) {
	fUIEvent_init(oEvent, oValue);
	//
	if ("screenX" in oValue)
		oEvent.screenX	= oValue.screenX;
	if ("screenY" in oValue)
		oEvent.screenY	= oValue.screenY;
	if ("clientX" in oValue)
		oEvent.clientX	= oValue.clientX;
	if ("clientY" in oValue)
		oEvent.clientY	= oValue.clientY;
	if ("ctrlKey" in oValue)
		oEvent.ctrlKey	= oValue.ctrlKey;
	if ("altKey" in oValue)
		oEvent.altKey	= oValue.altKey;
	if ("shiftKey" in oValue)
		oEvent.shiftKey	= oValue.shiftKey;
	if ("metaKey" in oValue)
		oEvent.metaKey	= oValue.metaKey;
	if ("button" in oValue)
		oEvent.button	= oValue.button;
	if ("relatedTarget" in oValue)
		oEvent.relatedTarget	= oValue.relatedTarget;
};

//
cMouseEvent.prototype.initMouseEvent	= function(sType, bBubbles, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, nButton, oRelatedTarget) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	fMouseEvent_init(this, fMouseEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, nButton, oRelatedTarget));
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
