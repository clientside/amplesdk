/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cTouchEvent	= function(sType) {
	this.type	= sType;
	// Initializer
	if (arguments.length > 1)
		fTouchEvent_init(this, arguments[1]);
};
cTouchEvent.prototype	= new cUIEvent('#' + "TouchEvent");

//
cTouchEvent.prototype.altKey	= null;
cTouchEvent.prototype.clientX	= null;
cTouchEvent.prototype.clientY	= null;
cTouchEvent.prototype.ctrlKey	= null;
cTouchEvent.prototype.metaKey	= null;
cTouchEvent.prototype.screenX	= null;
cTouchEvent.prototype.screenY	= null;
cTouchEvent.prototype.shiftKey	= null;
cTouchEvent.prototype.touches	= null;
cTouchEvent.prototype.targetTouches	= null;
cTouchEvent.prototype.changedTouches= null;
cTouchEvent.prototype.rotation	= null;
cTouchEvent.prototype.scale		= null;

function fTouchEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, oTouches, oTargetTouches, oChangedTouches, nScale, nRotation) {
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
	oValue.touches	= oTouches;
	oValue.targetTouches	= oTargetTouches;
	oValue.changedTouches	= oChangedTouches;
	oValue.scale	= nScale;
	oValue.rotation	= nRotation;

	return oValue;
};

function fTouchEvent_init(oEvent, oValue) {
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
	if ("touches" in oValue)
		oEvent.touches	= oValue.touches;
	if ("targetTouches" in oValue)
		oEvent.targetTouches	= oValue.targetTouches;
	if ("changedTouches" in oValue)
		oEvent.changedTouches	= oValue.changedTouches;
	if ("scale" in oValue)
		oEvent.scale	= oValue.scale;
	if ("rotation" in oValue)
		oEvent.rotation	= oValue.rotation;
};

//
cTouchEvent.prototype.initTouchEvent	= function(sType, bBubbles, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, oTouches, oTargetTouches, oChangedTouches, nScale, nRotation) {
	fTouchEvent_init(this, fTouchEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, oTouches, oTargetTouches, oChangedTouches, nScale, nRotation));
};