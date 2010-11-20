/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oTouchManager_scrollElement,
	nTouchManager_clientY	= 0,
	bTouchManager_scrollLeft,
	bTouchManager_scrollTop,
	nTouchManager_scrollLeft,
	nTouchManager_scrollTop;

function fTouchManager_onTouchStart(oEvent) {
	if (oEvent.touches.length == 1) {
		//
		oTouchManager_scrollElement	= null;
		nTouchManager_clientY	= oEvent.touches[0].clientY;
		//
		for (var oElement = oEvent.target.$getContainer(), oComputedStyle, sOverflow; oElement && oElement.nodeType == 1; oElement = oElement.parentNode) {
			oComputedStyle	= fBrowser_getComputedStyle(oElement);
			bTouchManager_scrollLeft	=
			bTouchManager_scrollTop		= (sOverflow = oComputedStyle.overflow) == "auto" || sOverflow == "scroll";
			if ((sOverflow = oComputedStyle.overflowX) == "auto" || sOverflow == "scroll")
				bTouchManager_scrollLeft	= true;
			if ((sOverflow = oComputedStyle.overflowY) == "auto" || sOverflow == "scroll")
				bTouchManager_scrollTop		= true;

			if (bTouchManager_scrollLeft || bTouchManager_scrollTop) {
				oTouchManager_scrollElement	= oElement;
				nTouchManager_scrollLeft	= oElement.scrollLeft + oEvent.touches[0].clientX;
				nTouchManager_scrollTop		= oElement.scrollTop + oEvent.touches[0].clientY;
				break;
			}
		}
	}
};

function fTouchManager_onTouchMove(oEvent) {
	var nClientX	= oEvent.touches[0].clientX,
		nClientY	= oEvent.touches[0].clientY;
	// Simulate wheel event
	if (nTouchManager_clientY - nClientY) {
		var oEventMouseWheel	= new cMouseWheelEvent;
		oEventMouseWheel.initMouseWheelEvent("mousewheel", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, 0, null, fBrowser_getKeyboardEventModifiersList(oEvent), nTouchManager_clientY	- nClientY);
		oEventMouseWheel.$pseudoTarget	= oEvent.$pseudoTarget;
		fNode_dispatchEvent(oEvent.target, oEventMouseWheel);
	}
	// Scroll scrollables
	if (oTouchManager_scrollElement) {
		if (bTouchManager_scrollLeft)
			oTouchManager_scrollElement.scrollLeft	= nTouchManager_scrollLeft - nClientX;
		if (bTouchManager_scrollTop)
			oTouchManager_scrollElement.scrollTop	= nTouchManager_scrollTop - nClientY;
		oEvent.preventDefault();
	}
	//
	nTouchManager_clientY	= nClientY;
};

function fTouchManager_onTouchEnd(oEvent) {
	if (oEvent.touches.length == 1)
		oTouchManager_scrollElement	= null;
};

// Attaching to implementation
fEventTarget_addEventListener(oAmple_document, "touchstart",	fTouchManager_onTouchStart,	false);
fEventTarget_addEventListener(oAmple_document, "touchmove",		fTouchManager_onTouchMove,	false);
fEventTarget_addEventListener(oAmple_document, "touchend",		fTouchManager_onTouchEnd,	false);