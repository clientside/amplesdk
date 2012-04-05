/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cTouchEvent	= function(){};
cTouchEvent.prototype	= new cUIEvent;
cTouchEvent.prototype.eventInterface	= "TouchEvent";

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

cTouchEvent.prototype.initTouchEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, oTouches, oTargetTouches, oChangedTouches, nScale, nRotation) {
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, nDetail);

	this.ctrlKey	= bCtrlKey;
	this.altKey		= bAltKey;
	this.metaKey	= bMetaKey;
	this.shiftKey	= bShiftKey;
	this.clientX	= nClientX;
	this.clientY	= nClientY;
	this.screenX	= nScreenX;
	this.screenY	= nScreenY;
	this.touches		= oTouches;
	this.targetTouches	= oTargetTouches;
	this.changedTouches	= oChangedTouches;
	this.scale		= nScale;
	this.rotation	= nRotation;
};