/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cCustomEvent	= function(){};
cCustomEvent.prototype	= new cEvent;
cCustomEvent.prototype.eventInterface	= "CustomEvent";

// nsIDOMCustomEvent
cCustomEvent.prototype.detail	= null;

cCustomEvent.prototype.initCustomEvent	= function(sType, bCanBubble, bCancelable, oDetail) {
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean],
		["detail",		cObject,	false, true]
	]);
//<-Guard

	this.initEvent(sType, bCanBubble, bCancelable);

	this.detail	= oDetail;
};
