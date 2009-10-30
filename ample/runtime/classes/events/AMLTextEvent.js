/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLTextEvent	= function(){};
cAMLTextEvent.prototype	= new cAMLEvent;

// nsIDOMTextEvent
cAMLTextEvent.prototype.view	= null;
cAMLTextEvent.prototype.data	= null;

cAMLTextEvent.prototype.initTextEvent	= function(sType, bCanBubble, bCancelable, oView, sData)
{
/*
	// Validate arguments
	fAML_validate(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	], "initTextEvent");
*/
	this.initEvent(sType, bCanBubble, bCancelable);

	this.view	= oView;
	this.data	= sData;
};
