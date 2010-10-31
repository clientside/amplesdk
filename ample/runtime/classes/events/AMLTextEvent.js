/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLTextEvent	= function(){};
cAMLTextEvent.prototype	= new cAMLUIEvent;

// nsIDOMTextEvent
cAMLTextEvent.prototype.data	= null;
cAMLTextEvent.prototype.inputMethod	= null;

cAMLTextEvent.prototype.initTextEvent	= function(sType, bCanBubble, bCancelable, oView, sData, nInputMethod)
{
/*
	// Validate arguments
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
*/
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, null);

	this.data	= sData;
	this.inputMethod	= nInputMethod;
};
