/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cGestureEvent	= function(sType) {
	this.type	= sType;
	// Initializer
	if (arguments.length > 1)
		fGestureEvent_init(arguments[1]);
};
cGestureEvent.prototype	= new cUIEvent('#' + "GestureEvent");

//
cGestureEvent.prototype.altKey	= null;
cGestureEvent.prototype.clientX	= null;
cGestureEvent.prototype.clientY	= null;
cGestureEvent.prototype.ctrlKey	= null;
cGestureEvent.prototype.metaKey	= null;
cGestureEvent.prototype.screenX	= null;
cGestureEvent.prototype.screenY	= null;
cGestureEvent.prototype.shiftKey	= null;
//cGestureEvent.prototype.target	= null;
cGestureEvent.prototype.rotation	= null;
cGestureEvent.prototype.scale		= null;

function fGestureEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, oTarget, nScale, nRotation) {
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
//	oValue.target	= oTarget;
	oValue.scale	= nScale;
	oValue.rotation	= nRotation;

	return oValue;
};

function fGestureEvent_init(oEvent, oValue) {
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
//	if ("target" in oValue)
//		oEvent.target	= oValue.target;
	if ("scale" in oValue)
		oEvent.scale	= oValue.scale;
	if ("rotation" in oValue)
		oEvent.rotation	= oValue.rotation;
};

//
cGestureEvent.prototype.initGestureEvent	= function(sType, bBubbles, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, oTarget, nScale, nRotation) {
	fFocusEvent_init(this, fFocusEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, oTarget, nScale, nRotation));
};