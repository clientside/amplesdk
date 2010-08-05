/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oAMLTouch_scrollElement,
	nAMLTouch_clientY	= 0,
	bAMLTouch_scrollLeft,
	bAMLTouch_scrollTop,
	nAMLTouch_scrollLeft,
	nAMLTouch_scrollTop;

function fAMLTouch_onTouchStart(oEvent) {
	if (oEvent.touches.length == 1) {
		//
		oAMLTouch_scrollElement	= null;
		nAMLTouch_clientY	= oEvent.touches[0].clientY;
		//
		for (var oElement = oEvent.target.$getContainer(), oStyle, sOverflow; oElement && oElement.nodeType == 1; oElement = oElement.parentNode) {
			oStyle	= fBrowser_getComputedStyle(oElement);
			bAMLTouch_scrollLeft	=
			bAMLTouch_scrollTop		= (sOverflow = oStyle.overflow) == "auto" || sOverflow == "scroll";
			if ((sOverflow = oStyle.overflowX) == "auto" || sOverflow == "scroll")
				bAMLTouch_scrollLeft	= true;
			if ((sOverflow = oStyle.overflowY) == "auto" || sOverflow == "scroll")
				bAMLTouch_scrollTop		= true;

			if (bAMLTouch_scrollLeft || bAMLTouch_scrollTop) {
				oAMLTouch_scrollElement	= oElement;
				nAMLTouch_scrollLeft	= oElement.scrollLeft + oEvent.touches[0].clientX;
				nAMLTouch_scrollTop		= oElement.scrollTop + oEvent.touches[0].clientY;
				break;
			}
		}
	}
};

function fAMLTouch_onTouchMove(oEvent) {
	var nClientX	= oEvent.touches[0].clientX,
		nClientY	= oEvent.touches[0].clientY;
	// Simulate wheel event
	if (nAMLTouch_clientY - nClientY) {
		var oEventMouseWheel	= new cAMLMouseWheelEvent;
		oEventMouseWheel.initMouseWheelEvent("mousewheel", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, 0, null, fBrowser_getKeyboardEventModifiersList(oEvent), nAMLTouch_clientY	- nClientY);
		oEventMouseWheel.$pseudoTarget	= oEvent.$pseudoTarget;
		fAMLNode_dispatchEvent(oEvent.target, oEventMouseWheel);
	}
	// Scroll scrollables
	if (oAMLTouch_scrollElement) {
		if (bAMLTouch_scrollLeft)
			oAMLTouch_scrollElement.scrollLeft	= nAMLTouch_scrollLeft - nClientX;
		if (bAMLTouch_scrollTop)
			oAMLTouch_scrollElement.scrollTop	= nAMLTouch_scrollTop - nClientY;
		oEvent.preventDefault();
	}
	//
	nAMLTouch_clientY	= nClientY;
};

function fAMLTouch_onTouchEnd(oEvent) {
	if (oEvent.touches.length == 1)
		oAMLTouch_scrollElement	= null;
};

// Attaching to implementation
fAMLEventTarget_addEventListener(oAmple_document, "touchstart",	fAMLTouch_onTouchStart,	false);
fAMLEventTarget_addEventListener(oAmple_document, "touchmove",	fAMLTouch_onTouchMove,	false);
fAMLEventTarget_addEventListener(oAmple_document, "touchend",		fAMLTouch_onTouchEnd,	false);