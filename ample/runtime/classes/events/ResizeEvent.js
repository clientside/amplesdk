/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cResizeEvent	= function(){};
cResizeEvent.prototype	= new cUIEvent;
cResizeEvent.prototype.eventInterface	= "ResizeEvent";

cResizeEvent.prototype.edge	= null;

// nsIDOMResizeEvent
cResizeEvent.prototype.initResizeEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail, nEdge) {
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, nDetail);

	//
	this.edge	= nEdge;
};