/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLUIEvent	= function(){};
cAMLUIEvent.prototype	= new cAMLEvent;

// nsIDOMUIEvent
cAMLUIEvent.prototype.view	= null;
cAMLUIEvent.prototype.detail	= null;

// Ample properties
cAMLUIEvent.prototype.$pseudoTarget	= null;	// readonly

cAMLUIEvent.prototype.initUIEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail)
{
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
