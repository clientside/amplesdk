/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cGestureEvent	= function(){};
cGestureEvent.prototype	= new cUIEvent;
cGestureEvent.prototype.eventInterface	= "GestureEvent";

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

cGestureEvent.prototype.initGestureEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, oTarget, nScale, nRotation) {
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, nDetail);

	this.ctrlKey	= bCtrlKey;
	this.altKey		= bAltKey;
	this.metaKey	= bMetaKey;
	this.shiftKey	= bShiftKey;
	this.clientX	= nClientX;
	this.clientY	= nClientY;
	this.screenX	= nScreenX;
	this.screenY	= nScreenY;
//	this.target		= oTarget;
	this.scale		= nScale;
	this.rotation	= nRotation;
};