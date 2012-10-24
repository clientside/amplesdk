/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Events
var aQuery_protectedEvents	= [
	// UIEvent
	"focus", "blur"
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
	,"textinput"
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

cQuery.prototype.trigger	= function(sType, oDetail) {
//->Guard
	fGuard(arguments, [
		["type",	cString],
		["detail",	cObject, true, true]
	]);
//<-Guard

	// Check if event triggering allowed
	if (aQuery_protectedEvents.indexOf(sType) !=-1)
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR, null, [sType]);

	if (arguments.length < 2)
		oDetail	= null;
	fQuery_each(this, function() {
		fQuery_trigger(this, sType, oDetail);
	});
};

cQuery.prototype.bind	= function(sType, fHandler, bCapture) {
//->Guard
	fGuard(arguments, [
		["type",	cString],
		["handler",	cObject],
		["capture",	cBoolean,	true]
	]);
//<-Guard

	fQuery_each(this, function() {
		fEventTarget_addEventListener(this, sType, fHandler, bCapture || false);
	});
	return this;
};

cQuery.prototype.unbind	= function(sType, fHandler, bCapture) {
//->Guard
	fGuard(arguments, [
		["type",	cString],
		["handler",	cObject],
		["capture",	cBoolean,	true]
	]);
//<-Guard

	fQuery_each(this, function() {
		fEventTarget_removeEventListener(this, sType, fHandler, bCapture || false);
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

	fEventTarget_addEventListener(oAmple_document, sType, fHandler, bCapture || false);
};

oAmple.unbind	= function(sType, fHandler, bCapture) {
//->Guard
	fGuard(arguments, [
		["type",	cString],
		["handler",	cObject],
		["capture",	cBoolean,	true]
	]);
//<-Guard

	fEventTarget_removeEventListener(oAmple_document, sType, fHandler, bCapture || false);
};

function fQuery_trigger(oNode, sType, oDetail) {
	var oEvent	= new cCustomEvent;
	oEvent.initCustomEvent(sType, true, true, oDetail);
	fEventTarget_dispatchEvent(oNode, oEvent);
};

oAmple.trigger	= function(sType, oDetail) {
//->Guard
	fGuard(arguments, [
		["type",	cString],
		["detail",	cObject, true, true]
	]);
//<-Guard

	// Check if event triggering allowed
	if (aQuery_protectedEvents.indexOf(sType) !=-1)
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR, null, [sType]);

	if (arguments.length < 2)
		oDetail	= null;

	fQuery_trigger(oAmple_document, sType, oDetail);
};