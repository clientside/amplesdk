/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oTouchManager_scrollElement,
	oTouchManager_scrollPseudo,
	nTouchManager_prevClientY	= nNaN,
	nTouchManager_prevClientX	= nNaN,
	nTouchManager_clientY	= 0,
	nTouchManager_clientX	= 0,
	bTouchManager_scrollLeft,
	bTouchManager_scrollTop,
	nTouchManager_scrollLeft,
	nTouchManager_scrollTop;

function fTouchManager_onTouchStart(oEvent) {
	if (oEvent.touches.length == 1) {
		//
		oTouchManager_scrollElement	= null;
		oTouchManager_scrollPseudo	= null;
		nTouchManager_clientY	= oEvent.touches[0].clientY;
		nTouchManager_clientX	= oEvent.touches[0].clientX;
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
				oTouchManager_scrollElement	= fAmple_instance(oAmple_document, oElement);
				oTouchManager_scrollPseudo	= oElement;
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
	if (oTouchManager_scrollPseudo) {
		if (bTouchManager_scrollLeft)
			oTouchManager_scrollPseudo.scrollLeft	= nTouchManager_scrollLeft - nClientX;
		if (bTouchManager_scrollTop)
			oTouchManager_scrollPseudo.scrollTop	= nTouchManager_scrollTop - nClientY;
		oEvent.preventDefault();
	}
	//
	nTouchManager_prevClientY	= nTouchManager_clientY;
	nTouchManager_prevClientX	= nTouchManager_clientX;
	nTouchManager_clientY	= nClientY;
	nTouchManager_clientX	= nClientX;
};

function fTouchManager_onTouchEnd(oEvent) {
	if (oEvent.touches.length == 0) {
		var oAnimation	= {},
			nOffsetLeft	= nTouchManager_prevClientX - nTouchManager_clientX,
			nOffsetTop	= nTouchManager_prevClientY - nTouchManager_clientY;
		if (bTouchManager_scrollLeft && cMath.abs(nOffsetLeft) > 5)
			oAnimation.scrollLeft	= oTouchManager_scrollPseudo.scrollLeft + nOffsetLeft * 10;
		if (bTouchManager_scrollTop && cMath.abs(nOffsetTop) > 5)
			oAnimation.scrollTop	= oTouchManager_scrollPseudo.scrollTop + nOffsetTop * 10;
		fNodeAnimation_play(oTouchManager_scrollElement, oAnimation, "normal", "easeout", null, oTouchManager_scrollPseudo);
		oTouchManager_scrollElement	= null;
		oTouchManager_scrollPseudo	= null;
		nTouchManager_prevClientY	= nNaN;
		nTouchManager_prevClientX	= nNaN;
	}
};

// Attaching to implementation
fEventTarget_addEventListener(oAmple_document, "touchstart",	fTouchManager_onTouchStart,	false);
fEventTarget_addEventListener(oAmple_document, "touchmove",		fTouchManager_onTouchMove,	false);
fEventTarget_addEventListener(oAmple_document, "touchend",		fTouchManager_onTouchEnd,	false);