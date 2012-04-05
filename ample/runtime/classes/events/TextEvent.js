/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cTextEvent	= function(){};
cTextEvent.prototype	= new cUIEvent;
cTextEvent.prototype.eventInterface	= "TextEvent";

// nsIDOMTextEvent
cTextEvent.DOM_INPUT_METHOD_UNKNOWN		= 0;
cTextEvent.DOM_INPUT_METHOD_KEYBOARD	= 1;
cTextEvent.DOM_INPUT_METHOD_PASTE		= 2;
cTextEvent.DOM_INPUT_METHOD_DROP		= 3;
cTextEvent.DOM_INPUT_METHOD_IME			= 4;
cTextEvent.DOM_INPUT_METHOD_OPTION		= 5;
cTextEvent.DOM_INPUT_METHOD_HANDWRITING	= 6;
cTextEvent.DOM_INPUT_METHOD_VOICE		= 7;
cTextEvent.DOM_INPUT_METHOD_MULTIMODAL	= 8;
cTextEvent.DOM_INPUT_METHOD_SCRIPT		= 9;

cTextEvent.prototype.data	= null;
cTextEvent.prototype.inputMethod	= null;
cTextEvent.prototype.locale	= null;

cTextEvent.prototype.initTextEvent	= function(sType, bCanBubble, bCancelable, oView, sData, nInputMethod, sLocale) {
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
	this.locale	= sLocale;
};
