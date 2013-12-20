/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cDragEvent	= function(sType) {
	this.type	= sType;
	// Initializer
	if (arguments.length > 1)
		fDragEvent_init(this, arguments[1]);
};
cDragEvent.prototype	= new cUIEvent('#' + "DragEvent");

// nsIDOMDragEvent
cDragEvent.prototype.dataTransfer	= null;

function fDragEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail, oDataTransfer) {
	var oValue	= fUIEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail);
	//
	oValue.dataTransfer	= oDataTransfer;

	return oValue;
};

function fDragEvent_init(oEvent, oValue) {
	fUIEvent_init(oEvent, oValue);
	//
	if ("dataTransfer" in oValue)
		oEvent.dataTransfer	= oValue.dataTransfer;
};

//
cDragEvent.prototype.initDragEvent	= function(sType, bBubbles, bCancelable, oView, nDetail, oDataTransfer) {
	fDragEvent_init(this, fDragEvent_getDictionary(sType, bBubbles, bCancelable, oView, nDetail, oDataTransfer));
};

cDragEvent.prototype.getModifierState	= function(sModifier) {
	switch (sModifier) {
		case "Alt":		return this.altKey;
		case "Control":	return this.ctrlKey;
		case "Meta":	return this.metaKey;
		case "Shift":	return this.shiftKey;
	}
	return false;
};