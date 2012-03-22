/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oTouch_scrollElement,
	oTouch_scrollPseudo,
	nTouch_prevClientY	= NaN,
	nTouch_prevClientX	= NaN,
	nTouch_clientY	= 0,
	nTouch_clientX	= 0,
	bTouch_scrollLeft,
	bTouch_scrollTop,
	nTouch_scrollLeft,
	nTouch_scrollTop;

function fTouch_onTouchStart(oEvent) {
	// Scroll implementation
	if (oEvent.touches.length == 1) {
		//
		oTouch_scrollElement	= null;
		oTouch_scrollPseudo		= null;
		nTouch_clientY	= oEvent.touches[0].clientY;
		nTouch_clientX	= oEvent.touches[0].clientX;
		//
		for (var oElement = oEvent.target.$getContainer(), oComputedStyle, sOverflow; oElement && oElement.nodeType == 1; oElement = oElement.parentNode) {
			oComputedStyle	= oElement.currentStyle || window.getComputedStyle(oElement, null);
			bTouch_scrollLeft	=
			bTouch_scrollTop	= (sOverflow = oComputedStyle.overflow) == "auto" || sOverflow == "scroll";
			if ((sOverflow = oComputedStyle.overflowX) == "auto" || sOverflow == "scroll")
				bTouch_scrollLeft	= true;
			if ((sOverflow = oComputedStyle.overflowY) == "auto" || sOverflow == "scroll")
				bTouch_scrollTop	= true;

			if (bTouch_scrollLeft || bTouch_scrollTop) {
				oTouch_scrollElement	= ample.$instance(oElement);
				oTouch_scrollPseudo		= oElement;
				nTouch_scrollLeft	= oElement.scrollLeft + oEvent.touches[0].clientX;
				nTouch_scrollTop	= oElement.scrollTop + oEvent.touches[0].clientY;
				break;
			}
		}
	}
};

function fTouch_onTouchMove(oEvent) {
	// Scroll implementation
	var nClientX	= oEvent.touches[0].clientX,
		nClientY	= oEvent.touches[0].clientY;
	// Simulate wheel event
	if (nTouch_clientY - nClientY) {
		var oEventWheel	= ample.createEvent("WheelEvent");
		oEventWheel.initWheelEvent("mousewheel", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, 0, null, '', 0, nTouch_clientY - nClientY, 0, 0);
		oEventWheel.$pseudoTarget	= oEvent.$pseudoTarget;
		oEventWheel.wheelDelta	= oEventWheel.deltaY;
		oEvent.target.dispatchEvent(oEventWheel);
	}
	// Scroll scrollables
	if (oTouch_scrollPseudo) {
		if (bTouch_scrollLeft)
			oTouch_scrollPseudo.scrollLeft	= nTouch_scrollLeft - nClientX;
		if (bTouch_scrollTop)
			oTouch_scrollPseudo.scrollTop	= nTouch_scrollTop - nClientY;
		//
		oEvent.preventDefault();
	}
	//
	nTouch_prevClientY	= nTouch_clientY;
	nTouch_prevClientX	= nTouch_clientX;
	nTouch_clientY	= nClientY;
	nTouch_clientX	= nClientX;
};

function fTouch_onTouchEnd(oEvent) {
	// Scroll implementation
	if (oEvent.touches.length == 0) {
		var oAnimation	= {},
			nOffsetLeft	= nTouch_prevClientX - nTouch_clientX,
			nOffsetTop	= nTouch_prevClientY - nTouch_clientY;
		if (oTouch_scrollPseudo) {
			if (bTouch_scrollLeft && Math.abs(nOffsetLeft) > 5)
				oAnimation.scrollLeft	= oTouch_scrollPseudo.scrollLeft + nOffsetLeft * 10;
			if (bTouch_scrollTop && Math.abs(nOffsetTop) > 5)
				oAnimation.scrollTop	= oTouch_scrollPseudo.scrollTop + nOffsetTop * 10;
			// Play animation
			ample.query(oTouch_scrollElement).animate(oAnimation, "normal", "easeout", null, oTouch_scrollPseudo);
		}
		oTouch_scrollElement	= null;
		oTouch_scrollPseudo		= null;
		nTouch_prevClientY	= NaN;
		nTouch_prevClientX	= NaN;
	}
};

function fTouch_onTouchCancel(oEvent) {

};

// Attaching to implementation
ample.addEventListener("touchstart",	fTouch_onTouchStart,	false);
ample.addEventListener("touchmove",		fTouch_onTouchMove,		false);
ample.addEventListener("touchend",		fTouch_onTouchEnd,		false);
ample.addEventListener("touchcancel",	fTouch_onTouchCancel,	false);