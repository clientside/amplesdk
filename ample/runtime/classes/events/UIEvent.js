/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cUIEvent	= function(sType) {
	fUIEvent_init(this, sType, arguments[1]);
};
cUIEvent.prototype	= new cEvent('#' + "UIEvent");

// nsIDOMUIEvent
cUIEvent.prototype.view		= null;
cUIEvent.prototype.detail	= null;

// Ample properties
cUIEvent.prototype.$pseudoTarget	= null;	// readonly

function fUIEvent_getDictionary(bBubbles, bCancelable, oView, nDetail) {
	var oValue	= fEvent_getDictionary(bBubbles, bCancelable);
	//
	oValue.view			= oView;
	oValue.detail		= nDetail;

	return oValue;
};

function fUIEvent_init(oEvent, sType, oValue) {
	fEvent_init(oEvent, sType, oValue);
	//
	if (oValue) {
		if ("view" in oValue)
			oEvent.view		= oValue.view;
		if ("detail" in oValue)
			oEvent.detail	= oValue.detail;
	}
};

// Public Methods
cUIEvent.prototype.initUIEvent	= function(sType, bBubbles, bCancelable, oView, nDetail) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["bubbles",		cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	fUIEvent_init(this, sType, fUIEvent_getDictionary(bBubbles, bCancelable, oView, nDetail));
};
