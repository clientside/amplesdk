/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cAMLTextEvent(){};
cAMLTextEvent.prototype	= new cAMLEvent;

// nsIDOMTextEvent
cAMLTextEvent.prototype.view	= null;
cAMLTextEvent.prototype.data	= null;

cAMLTextEvent.prototype.initTextEvent	= function(sType, bCanBubble, bCancelable, oView, sData)
{
/*
	// Validate arguments
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
*/
	this.initEvent(sType, bCanBubble, bCancelable);

	this.view	= oView;
	this.data	= sData;
};
