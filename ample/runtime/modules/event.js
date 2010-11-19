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
	,"modal"
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
	,"localechange"
];

cAMLQuery.prototype.trigger	= function(sType, oDetail) {
//->Guard
	fGuard(arguments, [
		["type",	cString],
		["detail",	cObject, true, true]
	]);
//<-Guard

	// Check if event triggering allowed
	if (aAMLQuery_protectedEvents.indexOf(sType) !=-1)
		throw new cAMLException(cAMLException.AML_TRIGGER_CORE_EVENT_ERR, null, [sType]);

	if (arguments.length < 2)
		oDetail	= null;
	fAMLQuery_each(this, function() {
		fAMLQuery_trigger(this, sType, oDetail);
	});
};

cAMLQuery.prototype.bind	= function(sType, fHandler, bCapture) {
//->Guard
	fGuard(arguments, [
		["type",	cString],
		["handler",	cObject],
		["capture",	cBoolean,	true]
	]);
//<-Guard

	fAMLQuery_each(this, function() {
		fAMLEventTarget_addEventListener(this, sType, fHandler, bCapture || false);
	});
	return this;
};

cAMLQuery.prototype.unbind	= function(sType, fHandler, bCaprure) {
//->Guard
	fGuard(arguments, [
		["type",	cString],
		["handler",	cObject],
		["capture",	cBoolean,	true]
	]);
//<-Guard

	fAMLQuery_each(this, function() {
		fAMLEventTarget_removeEventListener(this, sType, fHandler, bCapture || false);
	});
	return this;
};


// Global Object
oAmple.bind	= function(sType, fHandler, bCapture) {
//->Guard
	fGuard(arguments, [
		["type",	cString],
		["handler",	cObject],
		["capture",	cBoolean,	true]
	]);
//<-Guard

	fAMLEventTarget_addEventListener(oAmple_document, sType, fHandler, bCapture || false);
};

oAmple.unbind	= function(sType, fHandler, bCapture) {
//->Guard
	fGuard(arguments, [
		["type",	cString],
		["handler",	cObject],
		["capture",	cBoolean,	true]
	]);
//<-Guard

	fAMLEventTarget_removeEventListener(oAmple_document, sType, fHandler, bCapture || false);
};

function fAMLQuery_trigger(oNode, sType, oDetail) {
	var oEvent	= new cAMLCustomEvent;
	oEvent.initCustomEvent(sType, true, true, oDetail);
	fAMLNode_dispatchEvent(oNode, oEvent);
};

oAmple.trigger	= function(sType, oDetail) {
//->Guard
	fGuard(arguments, [
		["type",	cString],
		["detail",	cObject, true, true]
	]);
//<-Guard

	// Check if event triggering allowed
	if (aAMLQuery_protectedEvents.indexOf(sType) !=-1)
		throw new cAMLException(cAMLException.AML_TRIGGER_CORE_EVENT_ERR, null, [sType]);

	if (arguments.length < 2)
		oDetail	= null;

	fAMLQuery_trigger(oAmple_document, sType, oDetail);
};