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
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR
//->Debug
				, null
				, [sType]
//<-Debug
		);

	if (arguments.length < 2)
		oDetail	= null;

	return fQuery_trigger(this, sType, oDetail);
};

function fQuery_bindunbind(oQuery, sType, fHandler, bCapture, bUnbind) {
	var fFunction	= bUnbind ? fEventTarget_removeEventListener : fEventTarget_addEventListener;
	sType.split(/\s+/).forEach(function(sType) {
		fQuery_each(oQuery, function() {
			fFunction(this, sType, fHandler, bCapture || false);
		});
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

	fQuery_bindunbind(this, sType, fHandler, bCapture);
	//
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

	fQuery_bindunbind(this, sType, fHandler, bCapture, true);
	//
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

	fQuery_bindunbind(new cQuery(oAmple_document), sType, fHandler, bCapture);

	return this;
};

oAmple.unbind	= function(sType, fHandler, bCapture) {
//->Guard
	fGuard(arguments, [
		["type",	cString],
		["handler",	cObject],
		["capture",	cBoolean,	true]
	]);
//<-Guard

	fQuery_bindunbind(new cQuery(oAmple_document), sType, fHandler, bCapture, true);

	return this;
};

function fQuery_trigger(oQuery, sType, oDetail) {
	return fQuery_each(oQuery, function() {
		var oEvent	= new cCustomEvent;
		oEvent.initCustomEvent(sType, true, true, oDetail);
		fEventTarget_dispatchEvent(this, oEvent);
	});
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
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR
//->Debug
				, null
				, [sType]
//<-Debug
		);

	if (arguments.length < 2)
		oDetail	= null;

	fQuery_trigger(new cQuery(oAmple_document), sType, oDetail);

	return this;
};