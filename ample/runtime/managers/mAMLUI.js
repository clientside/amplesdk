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

oAML_document.addEventListener("mouseenter",	fAMLUI_mouseEnter,	true);
oAML_document.addEventListener("mouseleave",	fAMLUI_mouseLeave,	true);

// :focus pseudo-class
function fAMLUI_focus(oEvent) {
	oEvent.target.$setPseudoClass("focus", true);
};

function fAMLUI_blur(oEvent) {
	oEvent.target.$setPseudoClass("focus", false);
};

oAML_document.addEventListener("focus",		fAMLUI_focus,		true);
oAML_document.addEventListener("blur",		fAMLUI_blur,		true);

// :drag pseudo-class
function fAMLUI_dragStart(oEvent) {
	oEvent.target.$setPseudoClass("drag", true);
};

function fAMLUI_dragEnd(oEvent) {
	oEvent.target.$setPseudoClass("drag", false);
};

oAML_document.addEventListener("dragstart",	fAMLUI_dragStart,	true);
oAML_document.addEventListener("dragend",	fAMLUI_dragEnd,		true);

// :drop pseudo-class
function fAMLUI_dragEnter(oEvent) {
	oEvent.target.$setPseudoClass("drop", true);
};

function fAMLUI_dragLeave(oEvent) {
	oEvent.target.$setPseudoClass("drop", false);
};

oAML_document.addEventListener("dragenter",	fAMLUI_dragEnter,	true);
oAML_document.addEventListener("dragleave",	fAMLUI_dragLeave,	true);


// :resize pseudo-class
function fAMLUI_resizeStart(oEvent) {
	oEvent.target.$setPseudoClass("resize", true);
};

function fAMLUI_resizeEnd(oEvent) {
	oEvent.target.$setPseudoClass("resize", false);
};

oAML_document.addEventListener("resizestart",	fAMLUI_resizeStart,	true);
oAML_document.addEventListener("resizeend",		fAMLUI_resizeEnd,	true);
