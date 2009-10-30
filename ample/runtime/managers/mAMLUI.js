/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
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

ample.addEventListener("mouseenter",	fAMLUI_mouseEnter,	true);
ample.addEventListener("mouseleave",	fAMLUI_mouseLeave,	true);

// :focus pseudo-class
function fAMLUI_focus(oEvent) {
	oEvent.target.$setPseudoClass("focus", true);
};

function fAMLUI_blur(oEvent) {
	oEvent.target.$setPseudoClass("focus", false);
};

ample.addEventListener("focus",		fAMLUI_focus,		true);
ample.addEventListener("blur",		fAMLUI_blur,		true);

// :drag pseudo-class
function fAMLUI_dragStart(oEvent) {
	oEvent.target.$setPseudoClass("drag", true);
};

function fAMLUI_dragEnd(oEvent) {
	oEvent.target.$setPseudoClass("drag", false);
};

ample.addEventListener("dragstart",	fAMLUI_dragStart,	true);
ample.addEventListener("dragend",	fAMLUI_dragEnd,		true);

// :drop pseudo-class
function fAMLUI_dragEnter(oEvent) {
	oEvent.target.$setPseudoClass("drop", true);
};

function fAMLUI_dragLeave(oEvent) {
	oEvent.target.$setPseudoClass("drop", false);
};

ample.addEventListener("dragenter",	fAMLUI_dragEnter,	true);
ample.addEventListener("dragleave",	fAMLUI_dragLeave,	true);


// :resize pseudo-class
function fAMLUI_resizeStart(oEvent) {
	oEvent.target.$setPseudoClass("resize", true);
};

function fAMLUI_resizeEnd(oEvent) {
	oEvent.target.$setPseudoClass("resize", false);
};

ample.addEventListener("resizestart",	fAMLUI_resizeStart,	true);
ample.addEventListener("resizeend",		fAMLUI_resizeEnd,	true);
