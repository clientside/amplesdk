/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cDragEvent	= function(){};
cDragEvent.prototype	= new cUIEvent;
cDragEvent.prototype.eventInterface	= "DragEvent";

// nsIDOMDragEvent
cDragEvent.prototype.dataTransfer	= null;

cDragEvent.prototype.initDragEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail, oDataTransfer) {
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, nDetail);

	//
	this.dataTransfer	= oDataTransfer;
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