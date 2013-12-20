/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cWheelEvent	= function(sType) {
	fWheelEvent_init(this, sType, arguments[1]);
};
cWheelEvent.prototype	= new cMouseEvent('#' + "WheelEvent");

// Constants
cWheelEvent.DOM_DELTA_PIXEL	= 0;
cWheelEvent.DOM_DELTA_LINE	= 1;
cWheelEvent.DOM_DELTA_PAGE	= 2;

// nsIWheelEvent
cWheelEvent.prototype.deltaMode	= null;
cWheelEvent.prototype.deltaX	= null;
cWheelEvent.prototype.deltaY	= null;
cWheelEvent.prototype.deltaZ	= null;

function fWheelEvent_getDictionary(bBubbles, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, nButton, oRelatedTarget, sModifiersList, nDeltaX, nDeltaY, nDeltaZ, nDeltaMode) {
	var oValue	= fMouseEvent_getDictionary(bBubbles, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, sModifiersList.indexOf("Control") >-1, sModifiersList.indexOf("Alt") >-1, sModifiersList.indexOf("Shift") >-1, sModifiersList.indexOf("Meta") >-1, nButton, oRelatedTarget);
	//
	oValue.deltaX	= nDeltaX;
	oValue.deltaY	= nDeltaY;
	oValue.deltaZ	= nDeltaZ;
	oValue.deltaMode	= nDeltaMode;

	return oValue;
};

function fWheelEvent_init(oEvent, sType, oValue) {
	fMouseEvent_init(oEvent, sType, oValue);
	//
	if (oValue) {
		if ("deltaX" in oValue)
			oEvent.deltaX	= oValue.deltaX;
		if ("deltaY" in oValue)
			oEvent.deltaY	= oValue.deltaY;
		if ("deltaZ" in oValue)
			oEvent.deltaZ	= oValue.deltaZ;
		if ("deltaMode" in oValue)
			oEvent.deltaMode	= oValue.deltaMode;
	}
};

//
cWheelEvent.prototype.initWheelEvent	= function(sType, bBubbles, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, nButton, oRelatedTarget, sModifiersList, nDeltaX, nDeltaY, nDeltaZ, nDeltaMode) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["bubbles",		cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	fWheelEvent_init(this, sType, fWheelEvent_getDictionary(bBubbles, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, nButton, oRelatedTarget, sModifiersList, nDeltaX, nDeltaY, nDeltaZ, nDeltaMode));
};
