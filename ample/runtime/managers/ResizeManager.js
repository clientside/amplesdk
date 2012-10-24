/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var nResizeManager_STATE_RELEASED	= 0,	// Constants
	nResizeManager_STATE_CAPTURED	= 1,
	nResizeManager_STATE_RESIZED	= 2,

	nResizeManager_EDGE_NONE	= 0,
	nResizeManager_EDGE_TOP		= 1,
	nResizeManager_EDGE_RIGHT	= 2,
	nResizeManager_EDGE_BOTTOM	= 4,
	nResizeManager_EDGE_LEFT	= 8,

	oResizeManager_resizeNode	= null,		// Variables
	nResizeManager_resizeEdge	= nResizeManager_EDGE_NONE,
	nResizeManager_resizeState	= nResizeManager_STATE_RELEASED,

	nResizeManager_timeout,

	nResizeManager_widthMin,
	nResizeManager_widthMax,
	nResizeManager_heightMin,
	nResizeManager_heightMax,

	nResizeManager_mouseX,
	nResizeManager_mouseY,
	sResizeManager_originalLeft,
	sResizeManager_originalTop,
	sResizeManager_originalHeight,
	sResizeManager_originalWidth,
	nResizeManager_offsetLeft,
	nResizeManager_offsetTop,
	nResizeManager_offsetHeight,
	nResizeManager_offsetWidth;

// Functions
/*
function fResizeManager_startSession() {

};

function fResizeManager_finishSession() {

};

function fResizeManager_abortSession() {

};
*/

// Handlers
function fResizeManager_onMouseDown(oEvent) {
	if (oEvent.defaultPrevented || oEvent.button)
		return;

	// if drag and drop kicked in
	if (nDragAndDropManager_dragState)
		return;

	if (oResizeManager_resizeNode) {
		// Start session
		nResizeManager_resizeState	= nResizeManager_STATE_CAPTURED;

		// Simulate initial mousemove event
		nResizeManager_timeout	= fSetTimeout(function() {
			nResizeManager_timeout	= 0;
			//
			fResizeManager_onMouseMove.call(oEvent.currentTarget, oEvent);
		}, 200);
	}
};

function fResizeManager_onMouseMove(oEvent) {
	// Shows the resize indicator when hovering object edges
	if (nResizeManager_resizeState == nResizeManager_STATE_RELEASED) {
		//
		nResizeManager_mouseX	= oEvent.clientX;
		nResizeManager_mouseY	= oEvent.clientY;

		for (var oElement = oEvent.target; oElement != this; oElement = oElement.parentNode) {
			if (oElement.$resizable) {
				var oElementDOM	= oElement.$getContainer(),
					oComputedStyle	= fBrowser_getComputedStyle(oElementDOM),
					oRect	= fElement_getBoundingClientRect(oElement),
					nEdge	= nResizeManager_EDGE_NONE,
					nEdges	= oElement.$resizeEdges || 15,
					sCursor	= '';

				var nOffsetLeft	= nResizeManager_mouseX - oRect.left/* + oRect.scrollLeft*/,
					nOffsetTop	= nResizeManager_mouseY - oRect.top/* + oRect.scrollTop*/;

				// Vertical
				if (fResizeManager_inScope(nOffsetTop, fResizeManager_getStyleValueNumeric(oComputedStyle, "borderTopWidth"))) {
					nEdge	|= nEdges & nResizeManager_EDGE_TOP;
					sCursor	+= 'n';
				}
				else
				if (fResizeManager_inScope(nOffsetTop - oRect.bottom + oRect.top, fResizeManager_getStyleValueNumeric(oComputedStyle, "borderBottomWidth"))) {
					nEdge	|= nEdges & nResizeManager_EDGE_BOTTOM;
					sCursor	+= 's';
				}

				// Horizontal
				if (fResizeManager_inScope(nOffsetLeft, fResizeManager_getStyleValueNumeric(oComputedStyle, "borderLeftWidth"))) {
					nEdge	|= nEdges & nResizeManager_EDGE_LEFT;
					sCursor	+= 'w';
				}
				else
				if (fResizeManager_inScope(nOffsetLeft - oRect.right + oRect.left, fResizeManager_getStyleValueNumeric(oComputedStyle, "borderRightWidth"))) {
					nEdge	|= nEdges & nResizeManager_EDGE_RIGHT;
					sCursor	+= 'e';
				}

				//
				if (nEdge != nResizeManager_EDGE_NONE) {
					oResizeManager_resizeNode	= oElement;
					nResizeManager_resizeEdge	= nEdge;

					// set cursor
					oBrowser_root.style.cursor	= sCursor + '-' + "resize";

					return;
				}
			}
		}

		if (oResizeManager_resizeNode) {
			oResizeManager_resizeNode	= null;
			nResizeManager_resizeEdge	= nResizeManager_EDGE_NONE;

			// reset cursor
			oBrowser_root.style.cursor	= '';
		}
		return;
	}

	// Clear timeout
	if (nResizeManager_timeout)
		nResizeManager_timeout	= fClearTimeout(nResizeManager_timeout);

		// Stop event propagation
		oEvent.stopPropagation();

	var oElementDOM	= oResizeManager_resizeNode.$getContainer(),
		oRect	= fElement_getBoundingClientRect(oResizeManager_resizeNode),
		oStyle		= oElementDOM.style;

	// Turn mode to interactive
	if (nResizeManager_resizeState == nResizeManager_STATE_CAPTURED) {
		// fire onresizestart event
		var oEventResizeStart	= new cResizeEvent;
		oEventResizeStart.initResizeEvent("resizestart", true, true, window, null, nResizeManager_resizeEdge);
		oEventResizeStart.$pseudoTarget	= oEvent.$pseudoTarget;
		fEventTarget_dispatchEvent(oResizeManager_resizeNode, oEventResizeStart);

		if (oEventResizeStart.defaultPrevented) {
			// end operation and return
			nResizeManager_resizeState	= nResizeManager_STATE_RELEASED;
			return;
		}

		// Save current position
		sResizeManager_originalWidth	= oStyle.width;
		sResizeManager_originalHeight	= oStyle.height;
		sResizeManager_originalLeft		= oStyle.left;
		sResizeManager_originalTop		= oStyle.top;

		// Add :resize pseudo-class
		fElement_setPseudoClass(oResizeManager_resizeNode, "resize", true);

		// set capture and prevent selection
		fBrowser_toggleSelect(false);
		if (bTrident)
			oElementDOM.setCapture();
		fCaptureManager_setCapture(oResizeManager_resizeNode, true);

		var oComputedStyle	= fBrowser_getComputedStyle(oElementDOM),
			bBackCompat		= oUADocument.compatMode == "BackCompat";

		// move resizable position to (0, 0)
		oStyle.left	= 0;
		oStyle.top	= 0;

		// get resizable position at (0, 0)
		var oRect0	= fElement_getBoundingClientRect(oResizeManager_resizeNode);

		// restore resizable position
		oStyle.left	= sResizeManager_originalLeft;
		oStyle.top	= sResizeManager_originalTop;

		//
		nResizeManager_resizeState	= nResizeManager_STATE_RESIZED;

		nResizeManager_offsetWidth		=(oRect.right - oRect.left)	-(bBackCompat ? 0 : (fResizeManager_getStyleValueNumeric(oComputedStyle, "borderLeftWidth") + fResizeManager_getStyleValueNumeric(oComputedStyle, "borderRightWidth")) + fResizeManager_getStyleValueNumeric(oComputedStyle, "paddingLeft") + fResizeManager_getStyleValueNumeric(oComputedStyle, "paddingRight"));
		nResizeManager_offsetHeight		=(oRect.bottom - oRect.top)	-(bBackCompat ? 0 : (fResizeManager_getStyleValueNumeric(oComputedStyle, "borderTopWidth") + fResizeManager_getStyleValueNumeric(oComputedStyle, "borderBottomWidth")) + fResizeManager_getStyleValueNumeric(oComputedStyle, "paddingTop") + fResizeManager_getStyleValueNumeric(oComputedStyle, "paddingBottom"));
		nResizeManager_offsetLeft		= oRect.left	- oRect0.left;
		nResizeManager_offsetTop		= oRect.top		- oRect0.top;

		// Retrieve min/max allowed height/width
		nResizeManager_widthMin		= fParseInt(oComputedStyle[fUtilities_toCssPropertyName("min-width")] || oComputedStyle["min-width"]) || 0;
		nResizeManager_widthMax		= fParseInt(oComputedStyle[fUtilities_toCssPropertyName("max-width")] || oComputedStyle["max-width"]) || nInfinity;
		if (nResizeManager_widthMax < 0)	// Opera 10.5 returns -1
			nResizeManager_widthMax	= nInfinity;
		nResizeManager_heightMin	= fParseInt(oComputedStyle[fUtilities_toCssPropertyName("min-height")]|| oComputedStyle["min-height"]) || 0;
		nResizeManager_heightMax	= fParseInt(oComputedStyle[fUtilities_toCssPropertyName("max-height")]|| oComputedStyle["max-height"]) || nInfinity;
		if (nResizeManager_heightMax < 0)	// Opera 10.5 returns -1
			nResizeManager_heightMax= nInfinity;
	}

	// fire onresize event
	var oEventResize	= new cResizeEvent;
	oEventResize.initResizeEvent("resize", true, true, window, null, nResizeManager_resizeEdge);
	oEventResize.$pseudoTarget	= oEvent.$pseudoTarget;
	fEventTarget_dispatchEvent(oResizeManager_resizeNode, oEventResize);

	if (!oEventResize.defaultPrevented) {
		var nWidth		= nResizeManager_offsetWidth	+ (oEvent.clientX - nResizeManager_mouseX) * (nResizeManager_resizeEdge & nResizeManager_EDGE_LEFT ? -1 : 1),
			nHeight	= nResizeManager_offsetHeight	+ (oEvent.clientY - nResizeManager_mouseY) * (nResizeManager_resizeEdge & nResizeManager_EDGE_TOP ? -1 : 1);

		// Horizontal resize
		if (nWidth <= nResizeManager_widthMin)
			nWidth	= nResizeManager_widthMin;
		else
		if (nWidth >= nResizeManager_widthMax)
			nWidth	= nResizeManager_widthMax;
		// Set
		if (nResizeManager_resizeEdge & nResizeManager_EDGE_RIGHT)
			oStyle.width	= fResizeManager_ensureNonNegative(nWidth) + 'px';
		else
		if (nResizeManager_resizeEdge & nResizeManager_EDGE_LEFT) {
			oStyle.width	= fResizeManager_ensureNonNegative(nWidth) + 'px';
			oStyle.left		= fResizeManager_ensureNonNegative(nResizeManager_offsetWidth - nWidth + nResizeManager_offsetLeft) + 'px';
		}

		// Vertical resize
		if (nHeight <= nResizeManager_heightMin)
			nHeight	= nResizeManager_heightMin;
		else
		if (nHeight >= nResizeManager_heightMax)
			nHeight	= nResizeManager_heightMax;
		// Set
		if (nResizeManager_resizeEdge & nResizeManager_EDGE_BOTTOM)
			oStyle.height	= fResizeManager_ensureNonNegative(nHeight) + 'px';
		else
		if (nResizeManager_resizeEdge & nResizeManager_EDGE_TOP) {
			oStyle.height	= fResizeManager_ensureNonNegative(nHeight) + 'px';
			oStyle.top		= fResizeManager_ensureNonNegative(nResizeManager_offsetHeight - nHeight + nResizeManager_offsetTop) + 'px';
		}
	}

	// Opera doesn't support userSelect, so manual clearing of ranges is used
	if (!bTrident)
		window.getSelection().removeAllRanges();
};

function fResizeManager_onMouseUp(oEvent) {
	if (nResizeManager_resizeState == nResizeManager_STATE_RELEASED)
		return;

	// Clear timeout
	if (nResizeManager_timeout)
		nResizeManager_timeout	= fClearTimeout(nResizeManager_timeout);

	var oElementDOM	= oResizeManager_resizeNode.$getContainer();

	if (nResizeManager_resizeState == nResizeManager_STATE_RESIZED) {
		// Remove :resize pseudo-class
		fElement_setPseudoClass(oResizeManager_resizeNode, "resize", false);

		// fire onresizeend event
		var oEventResizeEnd	= new cResizeEvent;
		oEventResizeEnd.initResizeEvent("resizeend", true, true, window, null, nResizeManager_resizeEdge);
		oEventResizeEnd.$pseudoTarget	= oEvent.$pseudoTarget;
		fEventTarget_dispatchEvent(oResizeManager_resizeNode, oEventResizeEnd);

		if (oEventResizeEnd.defaultPrevented || (oEvent.defaultPrevented || oEvent.button)) {
			var oStyle		= oElementDOM.style,
				fRestore	= function() {
					oStyle.width	= sResizeManager_originalWidth;
					oStyle.height	= sResizeManager_originalHeight;
					oStyle.left		= sResizeManager_originalLeft;
					oStyle.top		= sResizeManager_originalTop;
				};

			// Restore element position
			if (oDOMConfiguration_values["ample-enable-transitions"]) {
				var oProperties	= {};
				oProperties["left"]		= sResizeManager_originalLeft || "auto";
				oProperties["top"]		= sResizeManager_originalTop || "auto";
				oProperties["width"]	= sResizeManager_originalWidth || "auto";
				oProperties["height"]	= sResizeManager_originalHeight || "auto";
				//
				fNodeAnimation_play(oResizeManager_resizeNode, oProperties, "normal", "ease", fRestore);
			}
			else
				fRestore();
		}

		// End session
		fBrowser_toggleSelect(true);
		if (bTrident)
			oElementDOM.releaseCapture();

		//
		fCaptureManager_releaseCapture(oResizeManager_resizeNode);
	}

	nResizeManager_resizeState	= nResizeManager_STATE_RELEASED;
	// Update position
	nResizeManager_mouseX	= oEvent.clientX;
	nResizeManager_mouseY	= oEvent.clientY;
};

function fResizeManager_onKeyDown(oEvent) {
	if (oEvent.keyIdentifier == "U+001B") {	// Esc
		oEvent.preventDefault();
		fResizeManager_onMouseUp(oEvent);
	}
};

// Utilities
function fResizeManager_getStyleValueNumeric(oStyle, sName, nValue) {
	var vValue	= fParseInt(oStyle[sName]);
	return fIsNaN(vValue) ? nValue || 0 : vValue;
};

function fResizeManager_ensureNonNegative(nValue) {
	return nValue < 0 ? 0 : nValue;
};

function fResizeManager_inScope(nValue, nBorder) {
	return cMath.abs(nValue) < cMath.max(5, nBorder);
};

// Attaching to implementation
// Public Properties
cElement.prototype.$resizable	= false;
cElement.prototype.$resizeEdges	= 0;

// Registering Event Handlers
fEventTarget_addEventListener(oAmple_document, "mousedown",	fResizeManager_onMouseDown,		false);
fEventTarget_addEventListener(oAmple_document, "mousemove",	fResizeManager_onMouseMove,		false);
fEventTarget_addEventListener(oAmple_document, "mouseup",	fResizeManager_onMouseUp,		false);
fEventTarget_addEventListener(oAmple_document, "keydown",	fResizeManager_onKeyDown,		false);
