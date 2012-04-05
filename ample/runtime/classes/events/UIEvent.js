/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cUIEvent	= function(){};
cUIEvent.prototype	= new cEvent;
cUIEvent.prototype.eventInterface	= "UIEvent";

// nsIDOMUIEvent
cUIEvent.prototype.view		= null;
cUIEvent.prototype.detail	= null;

// Ample properties
cUIEvent.prototype.$pseudoTarget	= null;	// readonly

cUIEvent.prototype.initUIEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	this.initEvent(sType, bCanBubble, bCancelable);

	this.view	= oView;
	this.detail	= nDetail;
};
