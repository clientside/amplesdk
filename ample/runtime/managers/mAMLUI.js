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
	if (oElement.$hoverable)
		oElement.$setPseudoClass("hover", true);
};

function fAMLUI_mouseLeave(oEvent) {
	var oElement	= oEvent.target;
	if (oElement.$hoverable)
		oElement.$setPseudoClass("hover", false);
};

// Attaching to impementation
cAMLElement.prototype.$hoverable	= false;

fAMLEventTarget_addEventListener(oAML_document, "mouseenter",	fAMLUI_mouseEnter,	true);
fAMLEventTarget_addEventListener(oAML_document, "mouseleave",	fAMLUI_mouseLeave,	true);

// :focus pseudo-class
function fAMLUI_focus(oEvent) {
	oEvent.target.$setPseudoClass("focus", true);
};

function fAMLUI_blur(oEvent) {
	oEvent.target.$setPseudoClass("focus", false);
};

fAMLEventTarget_addEventListener(oAML_document, "focus",	fAMLUI_focus,		true);
fAMLEventTarget_addEventListener(oAML_document, "blur",	fAMLUI_blur,		true);

// :drag pseudo-class
function fAMLUI_dragStart(oEvent) {
	oEvent.target.$setPseudoClass("drag", true);
};

function fAMLUI_dragEnd(oEvent) {
	oEvent.target.$setPseudoClass("drag", false);
};

fAMLEventTarget_addEventListener(oAML_document, "dragstart",	fAMLUI_dragStart,	true);
fAMLEventTarget_addEventListener(oAML_document, "dragend",		fAMLUI_dragEnd,		true);

// :drop pseudo-class
function fAMLUI_dragEnter(oEvent) {
	oEvent.target.$setPseudoClass("drop", true);
};

function fAMLUI_dragLeave(oEvent) {
	oEvent.target.$setPseudoClass("drop", false);
};

fAMLEventTarget_addEventListener(oAML_document, "dragenter",	fAMLUI_dragEnter,	true);
fAMLEventTarget_addEventListener(oAML_document, "dragleave",	fAMLUI_dragLeave,	true);


// :resize pseudo-class
function fAMLUI_resizeStart(oEvent) {
	oEvent.target.$setPseudoClass("resize", true);
};

function fAMLUI_resizeEnd(oEvent) {
	oEvent.target.$setPseudoClass("resize", false);
};

fAMLEventTarget_addEventListener(oAML_document, "resizestart",	fAMLUI_resizeStart,	true);
fAMLEventTarget_addEventListener(oAML_document, "resizeend",	fAMLUI_resizeEnd,	true);
