/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cWheelEvent	= function(){};
cWheelEvent.prototype	= new cMouseEvent;
cWheelEvent.prototype.eventInterface	= "WheelEvent";

// Constants
cWheelEvent.DOM_DELTA_PIXEL	= 0;
cWheelEvent.DOM_DELTA_LINE	= 1;
cWheelEvent.DOM_DELTA_PAGE	= 2;

// nsIWheelEvent
cWheelEvent.prototype.deltaMode	= null;
cWheelEvent.prototype.deltaX	= null;
cWheelEvent.prototype.deltaY	= null;
cWheelEvent.prototype.deltaZ	= null;

cWheelEvent.prototype.initWheelEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, nButton, oRelatedTarget, sModifiersList, nDeltaX, nDeltaY, nDeltaZ, nDeltaMode) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	this.initMouseEvent(sType, bCanBubble, bCancelable, oView, nDetail, nScreenX, nScreenY, nClientX, nClientY, sModifiersList.indexOf("Control") >-1, sModifiersList.indexOf("Alt") >-1, sModifiersList.indexOf("Shift") >-1, sModifiersList.indexOf("Meta") >-1, nButton, oRelatedTarget);

	this.deltaX		= nDeltaX;
	this.deltaY		= nDeltaY;
	this.deltaZ		= nDeltaZ;
	this.deltaMode	= nDeltaMode;
};
