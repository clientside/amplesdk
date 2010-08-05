/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// :hover pseudo-class
function fAMLUI_mouseEnter(oEvent) {
	var oElement	= oEvent.target;
	if (oElement.$hoverable && oElement.$isAccessible())
		fAMLElement_setPseudoClass(oElement, "hover", true);
};

function fAMLUI_mouseLeave(oEvent) {
	var oElement	= oEvent.target;
	if (oElement.$hoverable && oElement.$isAccessible())
		fAMLElement_setPseudoClass(oElement, "hover", false);
};

// Attaching to implementation
cAMLElement.prototype.$hoverable	= false;

fAMLEventTarget_addEventListener(oAmple_document, "mouseenter",	fAMLUI_mouseEnter,	true);
fAMLEventTarget_addEventListener(oAmple_document, "mouseleave",	fAMLUI_mouseLeave,	true);

// :focus pseudo-class
function fAMLUI_focus(oEvent) {
	fAMLElement_setPseudoClass(oEvent.target, "focus", true);
};

function fAMLUI_blur(oEvent) {
	fAMLElement_setPseudoClass(oEvent.target, "focus", false);
};

fAMLEventTarget_addEventListener(oAmple_document, "focus",	fAMLUI_focus,		true);
fAMLEventTarget_addEventListener(oAmple_document, "blur",		fAMLUI_blur,		true);

// :drag pseudo-class
function fAMLUI_dragStart(oEvent) {
	if (!oEvent.defaultPrevented)
		fAMLElement_setPseudoClass(oEvent.target, "drag", true);
};

function fAMLUI_dragEnd(oEvent) {
	fAMLElement_setPseudoClass(oEvent.target, "drag", false);
};

fAMLEventTarget_addEventListener(oAmple_document, "dragstart",	fAMLUI_dragStart,	true);
fAMLEventTarget_addEventListener(oAmple_document, "dragend",		fAMLUI_dragEnd,		true);

// :drop pseudo-class
function fAMLUI_dragEnter(oEvent) {
	fAMLElement_setPseudoClass(oEvent.target, "drop", true);
};

function fAMLUI_dragLeave(oEvent) {
	fAMLElement_setPseudoClass(oEvent.target, "drop", false);
};

fAMLEventTarget_addEventListener(oAmple_document, "dragenter",	fAMLUI_dragEnter,	true);
fAMLEventTarget_addEventListener(oAmple_document, "dragleave",	fAMLUI_dragLeave,	true);


// :resize pseudo-class
function fAMLUI_resizeStart(oEvent) {
	if (!oEvent.defaultPrevented)
		fAMLElement_setPseudoClass(oEvent.target, "resize", true);
};

function fAMLUI_resizeEnd(oEvent) {
	fAMLElement_setPseudoClass(oEvent.target, "resize", false);
};

fAMLEventTarget_addEventListener(oAmple_document, "resizestart",	fAMLUI_resizeStart,	true);
fAMLEventTarget_addEventListener(oAmple_document, "resizeend",	fAMLUI_resizeEnd,	true);
