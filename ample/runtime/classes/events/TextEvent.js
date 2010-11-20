/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cTextEvent	= function(){};
cTextEvent.prototype	= new cUIEvent;

// nsIDOMTextEvent
cTextEvent.prototype.data	= null;
cTextEvent.prototype.inputMethod	= null;

cTextEvent.prototype.initTextEvent	= function(sType, bCanBubble, bCancelable, oView, sData, nInputMethod)
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
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, null);

	this.data	= sData;
	this.inputMethod	= nInputMethod;
};
