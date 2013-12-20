/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cResizeEvent	= function(sType) {
	this.type	= sType;
	// Initializer
	if (arguments.length > 1)
		fResizeEvent_init(arguments[1]);
};
cResizeEvent.prototype	= new cUIEvent('#' + "ResizeEvent");

cResizeEvent.prototype.edge	= null;

function fResizeEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail, nEdge) {
	var oValue	= fUIEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail);
	//
	oValue.edge	= nEdge;

	return oValue;
};

function fResizeEvent_init(oEvent, oValue) {
	fUIEvent_init(oEvent, oValue);
	//
	if ("edge" in oValue)
		oEvent.edge	= oValue.edge;
};

// nsIDOMResizeEvent
cResizeEvent.prototype.initResizeEvent	= function(sType, bBubbles, bCancelable, oView, nDetail, nEdge) {
	fResizeEvent_init(this, fResizeEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail, nEdge));
};
