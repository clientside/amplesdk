/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Events
var aAMLQuery_protectedEvents	= [
	// UIEvent
	,"focus", "blur"
	,"DOMFocusIn", "DOMFocusOut", "DOMActivate"
	,"capture", "losecapture"
	//
	,"resize", "scroll"
	// KeyboardEvent
	,"keydown", "keyup"
	// MouseEvent
	,"mousedown", "mouseup", "click"
	,"mousewheel", "mousemove"
	,"mouseover", "mouseout"
	,"mouseenter", "mousewheel"
	,"touchstart", "touchmove", "touchend", "touchcancel"
	,"gesturestart", "gesturechange", "gestureend"
	// TextEvent
	,"textInput"
	// Legacy events
	,"contextmenu", "dblclick", "keypress"
	// MutationEvent
	,"DOMNodeInserted", "DOMNodeRemoved", "DOMNodeInsertedIntoDocument", "DOMNodeRemovedFromDocument"
	,"DOMAttrModified"
	,"DOMCharacterDataModified"
	// DragAndDropEvent
	,"drag", "drop", "dragstart", "dragend", "dragover", "dragenter", "dragleave"
	// ResizeEvent
	,"resizestart", "resize", "resizeend"
	// EffectEvent
	,"effectstart", "effectend"
	// Other
	,"hashchange"
	,"readystatechange"
	,"configchange"
];

cAMLQuery.prototype.trigger	= function(sType, oDetail) {
	// Validate API call
	fGuard(arguments, [
		["type",	cString],
		["detail",	oDetail, true, true]
	]);

	// Check if event triggering allowed
	if (aAMLQuery_protectedEvents.indexOf(sType) !=-1)
		throw new cAMLException(cAMLException.AML_TRIGGER_CORE_EVENT_ERR, null, [sType]);

	// Invoke implementation
	if (arguments.length < 2)
		oDetail	= null;
	fAMLQuery_each(this, function() {
		var oEvent	= new cAMLCustomEvent;
		oEvent.initCustomEvent(sType, true, true, oDetail);
		fAMLNode_dispatchEvent(this, oEvent);
	});
};

cAMLQuery.prototype.bind	= function(sType, fHandler, bCapture) {
	// Validate API call
	fGuard(arguments, [
		["type",	cString],
		["handler",	cObject],
		["capture",	cBoolean,	true]
	]);

	// Invoke implementation
	fAMLQuery_each(this, function() {
		fAMLEventTarget_addEventListener(this, sType, fHandler, bCapture || false);
	});
	return this;
};

cAMLQuery.prototype.unbind	= function(sType, fHandler, bCaprure) {
	// Validate API call
	fGuard(arguments, [
		["type",	cString],
		["handler",	cObject],
		["capture",	cBoolean,	true]
	]);

	// Invoke implementation
	fAMLQuery_each(this, function() {
		fAMLEventTarget_removeEventListener(this, sType, fHandler, bCapture || false);
	});
	return this;
};


// Global Object
oAmple.bind	= function(sType, fHandler, bCapture) {
	// Validate API call
	fGuard(arguments, [
		["type",	cString],
		["handler",	cObject],
		["capture",	cBoolean,	true]
	]);

	// Invoke implementation
	fAMLEventTarget_addEventListener(oAmple_document, sType, fHandler, bCapture || false);
};

oAmple.unbind	= function(sType, fHandler, bCapture) {
	// Validate API call
	fGuard(arguments, [
		["type",	cString],
		["handler",	cObject],
		["capture",	cBoolean,	true]
	]);

	// Invoke implementation
	fAMLEventTarget_removeEventListener(oAmple_document, sType, fHandler, bCapture || false);
};

oAmple.trigger	= function(sType, oDetail) {
	// Validate API call
	fGuard(arguments, [
		["type",	cString],
		["detail",	oDetail, true, true]
	]);

	// Check if event triggering allowed
	if (aAMLQuery_protectedEvents.indexOf(sType) !=-1)
		throw new cAMLException(cAMLException.AML_TRIGGER_CORE_EVENT_ERR, null, [sType]);

	// Invoke implementation
	if (arguments.length < 2)
		oDetail	= null;

	var oEvent	= new cAMLCustomEvent;
	oEvent.initCustomEvent(sType, true, true, oDetail);
	fAMLNode_dispatchEvent(oAmple_document, oEvent);
};