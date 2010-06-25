/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLTouchEvent	= function(){};
cAMLTouchEvent.prototype	= new cAMLUIEvent;

//
cAMLTouchEvent.prototype.altKey		= null;
cAMLTouchEvent.prototype.clientX	= null;
cAMLTouchEvent.prototype.clientY	= null;
cAMLTouchEvent.prototype.ctrlKey	= null;
cAMLTouchEvent.prototype.metaKey	= null;
cAMLTouchEvent.prototype.screenX	= null;
cAMLTouchEvent.prototype.screenY	= null;
cAMLTouchEvent.prototype.shiftKey	= null;
cAMLTouchEvent.prototype.touches		= null;
cAMLTouchEvent.prototype.targetTouches	= null;
cAMLTouchEvent.prototype.changedTouches	= null;
cAMLTouchEvent.prototype.rotation	= null;
cAMLTouchEvent.prototype.scale		= null;

cAMLTouchEvent.prototype.initTouchEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, oTouches, oTargetTouches, oChangedTouches, nScale, nRotation)
{
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