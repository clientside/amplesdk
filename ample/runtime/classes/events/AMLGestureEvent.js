/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLGestureEvent	= function(){};
cAMLGestureEvent.prototype	= new cAMLUIEvent;

//
cAMLGestureEvent.prototype.altKey	= null;
cAMLGestureEvent.prototype.clientX	= null;
cAMLGestureEvent.prototype.clientY	= null;
cAMLGestureEvent.prototype.ctrlKey	= null;
cAMLGestureEvent.prototype.metaKey	= null;
cAMLGestureEvent.prototype.screenX	= null;
cAMLGestureEvent.prototype.screenY	= null;
cAMLGestureEvent.prototype.shiftKey	= null;
//cAMLGestureEvent.prototype.target	= null;
cAMLGestureEvent.prototype.rotation	= null;
cAMLGestureEvent.prototype.scale	= null;

cAMLGestureEvent.prototype.initGestureEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, bCtrlKey, bAltKey, bShiftKey, bMetaKey, oTarget, nScale, nRotation)
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
//	this.target		= oTarget;
	this.scale		= nScale;
	this.rotation	= nRotation;
};