/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLFocusEvent	= function(){};
cAMLFocusEvent.prototype	= new cAMLUIEvent;

// nsIDOMFocusEvent
cAMLFocusEvent.prototype.relatedTarget	= null;

cAMLFocusEvent.prototype.initFocusEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail, oRelatedTarget)
{
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, nDetail);

	this.relatedTarget	= oRelatedTarget;
};