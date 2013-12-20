/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cUIEvent	= function(sType) {
	this.type	= sType;
	// Initializer
	if (arguments.length > 1)
		fUIEvent_init(this, arguments[1]);
};
cUIEvent.prototype	= new cEvent('#' + "UIEvent");

// nsIDOMUIEvent
cUIEvent.prototype.view		= null;
cUIEvent.prototype.detail	= null;

// Ample properties
cUIEvent.prototype.$pseudoTarget	= null;	// readonly

function fUIEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail) {
	var oValue	= fEvent_getDictionary(sType, bBubbles, bCancelable);
	//
	oValue.view			= oView;
	oValue.detail		= nDetail;

	return oValue;
};

function fUIEvent_init(oEvent, oValue) {
	fEvent_init(oEvent, oValue);
	//
	if ("view" in oValue)
		oEvent.view		= oValue.view;
	if ("detail" in oValue)
		oEvent.detail	= oValue.detail;
};

// Public Methods
cUIEvent.prototype.initUIEvent	= function(sType, bBubbles, bCancelable, oView, nDetail) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	fUIEvent_init(this, fUIEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail));
};
