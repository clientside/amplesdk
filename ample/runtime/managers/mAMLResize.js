/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var nAMLResize_STATE_RELEASED	= 0,	// Constants
	nAMLResize_STATE_CAPTURED	= 1,
	nAMLResize_STATE_RESIZED	= 2,

	nAMLResize_EDGE_NONE	= 0,
	nAMLResize_EDGE_TOP		= 1,
	nAMLResize_EDGE_RIGHT	= 2,
	nAMLResize_EDGE_BOTTOM	= 4,
	nAMLResize_EDGE_LEFT	= 8,

	oAMLResize_resizeNode	= null,		// Variables
	nAMLResize_resizeEdge	= nAMLResize_EDGE_NONE,
	nAMLResize_resizeState	= nAMLResize_STATE_RELEASED,

	nAMLResize_widthMin,
	nAMLResize_widthMax,
	nAMLResize_heightMin,
	nAMLResize_heightMax,

	nAMLResize_mouseX,
	nAMLResize_mouseY,
	sAMLResize_clientLeft,
	sAMLResize_clientTop,
	sAMLResize_clientHeight,
	sAMLResize_clientWidth,
	nAMLResize_offsetLeft,
	nAMLResize_offsetTop,
	nAMLResize_offsetHeight,
	nAMLResize_offsetWidth;

// Functions
/*
function fAMLResize_startSession() {

};

function fAMLResize_finishSession() {

};

function fAMLResize_abortSession() {

};
*/

// Handlers
function fAMLResize_onMouseDown(oEvent)
{
	if (oEvent.defaultPrevented)
		return;

	// Only react on left button
	if (oEvent.button)
		return;

	// if drag and drop kicked in
	if (nAMLDragAndDrop_dragState)
		return;

	if (oAMLResize_resizeNode)
	{
		// Start session
	    nAMLResize_resizeState	= nAMLResize_STATE_CAPTURED;

	    fAMLCapture_setCapture(oAMLResize_resizeNode, true);

	    // Simulate initial mousemove event
		fSetTimeout(function() {
			fAMLResize_onMouseMove.call(oEvent.currentTarget, oEvent);
		}, 0);
	}
};

function fAMLResize_onMouseMove(oEvent)
{
	// Shows the resize indicator when hovering object edges
	if (nAMLResize_resizeState == nAMLResize_STATE_RELEASED)
	{
		//
	    nAMLResize_mouseX	= oEvent.clientX;
	    nAMLResize_mouseY	= oEvent.clientY;

		for (var oElement = oEvent.target; oElement != this; oElement = oElement.parentNode)
		{
			if (oElement.$resizable)
			{
				var oElementDOM	= oElement.$getContainer(),
					oComputedStyle	= fBrowser_getComputedStyle(oElementDOM),
					oRect	= fAMLElement_getBoundingClientRect(oElement),
					nResize		= nAMLResize_EDGE_NONE,
					nResizeEdges= oElement.$resizeEdges || 15,
					sCursor		= '';

				var nOffsetLeft	= nAMLResize_mouseX - oRect.left/* + oRect.scrollLeft*/,
					nOffsetTop	= nAMLResize_mouseY - oRect.top/* + oRect.scrollTop*/;

				// Vertical
				if (fAMLResize_inScope(nOffsetTop, fAMLResize_getStyleValueNumeric(oComputedStyle, "borderTopWidth")))
				{
					nResize|= nResizeEdges & nAMLResize_EDGE_TOP;
					sCursor+= 'n';
				}
				else
				if (fAMLResize_inScope(nOffsetTop - oRect.bottom + oRect.top, fAMLResize_getStyleValueNumeric(oComputedStyle, "borderBottomWidth")))
				{
					nResize|= nResizeEdges & nAMLResize_EDGE_BOTTOM;
					sCursor+= 's';
				}

				// Horizontal
				if (fAMLResize_inScope(nOffsetLeft, fAMLResize_getStyleValueNumeric(oComputedStyle, "borderLeftWidth")))
				{
					nResize|= nResizeEdges & nAMLResize_EDGE_LEFT;
					sCursor+= 'w';
				}
				else
				if (fAMLResize_inScope(nOffsetLeft - oRect.right + oRect.left, fAMLResize_getStyleValueNumeric(oComputedStyle, "borderRightWidth")))
				{
					nResize|= nResizeEdges & nAMLResize_EDGE_RIGHT;
					sCursor+= 'e';
				}

				//
				if (nResize != nAMLResize_EDGE_NONE)
				{
					oAMLResize_resizeNode	= oElement;
					nAMLResize_resizeEdge	= nResize;

					// set cursor
					oUADocument.documentElement.style.cursor	= sCursor + '-' + "resize";

					return;
				}
			}
		}

		if (oAMLResize_resizeNode)
		{
			oAMLResize_resizeNode	= null;
			nAMLResize_resizeEdge	= nAMLResize_EDGE_NONE;

			// reset cursor
			oUADocument.documentElement.style.cursor	= '';
		}
		return;
	}

   	// Stop event propagation
   	oEvent.stopPropagation();

	var oElementDOM	= oAMLResize_resizeNode.$getContainer(),
		oRect	= fAMLElement_getBoundingClientRect(oAMLResize_resizeNode),
		oStyle		= oElementDOM.style;

	// Turn mode to interactive
    if (nAMLResize_resizeState == nAMLResize_STATE_CAPTURED)
    {
		// fire onresizestart event
		var oEventResizeStart	= new cAMLResizeEvent;
		oEventResizeStart.initResizeEvent("resizestart", true, true, window, null, nAMLResize_resizeEdge);
		oEventResizeStart.$pseudoTarget	= oEvent.$pseudoTarget;
		fAMLNode_dispatchEvent(oAMLResize_resizeNode, oEventResizeStart);

		if (oEventResizeStart.defaultPrevented) {
			// end operation and return
			nAMLResize_resizeState	= nAMLResize_STATE_RELEASED;
			return;
		}

		// Save current position
		sAMLResize_clientWidth		= oStyle.width;
		sAMLResize_clientHeight		= oStyle.height;
		sAMLResize_clientLeft		= oStyle.left;
		sAMLResize_clientTop		= oStyle.top;

		// Add :resize pseudo-class
		fAMLElement_setPseudoClass(oAMLResize_resizeNode, "resize", true);

		// set capture and prevent selection
		fBrowser_toggleSelect(false);
		if (bTrident)
			oAMLResize_resizeNode.$getContainer().setCapture();

		var oComputedStyle	= fBrowser_getComputedStyle(oElementDOM),
			bBackCompat		= oUADocument.compatMode == "BackCompat";

		// move resizable position to (0, 0)
		oStyle.left	= '0';
		oStyle.top	= '0';

		// get resizable position at (0, 0)
		var oRect0	= fAMLElement_getBoundingClientRect(oAMLResize_resizeNode);

		// restore resizable position
		oStyle.left	= sAMLResize_clientLeft;
		oStyle.top	= sAMLResize_clientTop;

	    //
    	nAMLResize_resizeState	= nAMLResize_STATE_RESIZED;

	    nAMLResize_offsetWidth		=(oRect.right - oRect.left)	-(bBackCompat ? 0 : (fAMLResize_getStyleValueNumeric(oComputedStyle, "borderLeftWidth") + fAMLResize_getStyleValueNumeric(oComputedStyle, "borderRightWidth")) + fAMLResize_getStyleValueNumeric(oComputedStyle, "paddingLeft") + fAMLResize_getStyleValueNumeric(oComputedStyle, "paddingRight"));
	    nAMLResize_offsetHeight		=(oRect.bottom - oRect.top)	-(bBackCompat ? 0 : (fAMLResize_getStyleValueNumeric(oComputedStyle, "borderTopWidth") + fAMLResize_getStyleValueNumeric(oComputedStyle, "borderBottomWidth")) + fAMLResize_getStyleValueNumeric(oComputedStyle, "paddingTop") + fAMLResize_getStyleValueNumeric(oComputedStyle, "paddingBottom"));
	    nAMLResize_offsetLeft		= oRect.left	- oRect0.left;
	    nAMLResize_offsetTop		= oRect.top		- oRect0.top;

		// Retrieve min/max allowed height/width
		nAMLResize_widthMin		= fParseInt(oComputedStyle[fUtilities_toCssPropertyName("min-width")] || oComputedStyle["min-width"]) || 0;
		nAMLResize_widthMax		= fParseInt(oComputedStyle[fUtilities_toCssPropertyName("max-width")] || oComputedStyle["max-width"]) || nInfinity;
		if (nAMLResize_widthMax < 0)	// Opera 10.5 returns -1
			nAMLResize_widthMax	= nInfinity;
		nAMLResize_heightMin	= fParseInt(oComputedStyle[fUtilities_toCssPropertyName("min-height")]|| oComputedStyle["min-height"]) || 0;
		nAMLResize_heightMax	= fParseInt(oComputedStyle[fUtilities_toCssPropertyName("max-height")]|| oComputedStyle["max-height"]) || nInfinity;
		if (nAMLResize_heightMax < 0)	// Opera 10.5 returns -1
			nAMLResize_heightMax= nInfinity;
    }

	// fire onresize event
	var oEventResize	= new cAMLResizeEvent;
    oEventResize.initResizeEvent("resize", true, true, window, null, nAMLResize_resizeEdge);
    oEventResize.$pseudoTarget	= oEvent.$pseudoTarget;
    fAMLNode_dispatchEvent(oAMLResize_resizeNode, oEventResize);

	if (!oEventResize.defaultPrevented)
	{
		var nWidth		= nAMLResize_offsetWidth	+ (oEvent.clientX - nAMLResize_mouseX) * (nAMLResize_resizeEdge & nAMLResize_EDGE_LEFT ? -1 : 1),
			nHeight	= nAMLResize_offsetHeight	+ (oEvent.clientY - nAMLResize_mouseY) * (nAMLResize_resizeEdge & nAMLResize_EDGE_TOP  ? -1 : 1);

		// Horizontal resize
		if (nWidth <= nAMLResize_widthMin)
			nWidth	= nAMLResize_widthMin;
		else
		if (nWidth >= nAMLResize_widthMax)
			nWidth	= nAMLResize_widthMax;
		// Set
		if (nAMLResize_resizeEdge & nAMLResize_EDGE_RIGHT)
    		oStyle.width	= fAMLResize_ensureNonNegative(nWidth) + 'px';
	    else
		if (nAMLResize_resizeEdge & nAMLResize_EDGE_LEFT) {
			oStyle.width	= fAMLResize_ensureNonNegative(nWidth) + 'px';
			oStyle.left		= fAMLResize_ensureNonNegative(nAMLResize_offsetWidth - nWidth + nAMLResize_offsetLeft) + 'px';
		}

		// Vertical resize
		if (nHeight <= nAMLResize_heightMin)
			nHeight	= nAMLResize_heightMin;
		else
		if (nHeight >= nAMLResize_heightMax)
			nHeight	= nAMLResize_heightMax;
		// Set
		if (nAMLResize_resizeEdge & nAMLResize_EDGE_BOTTOM)
	    	oStyle.height	= fAMLResize_ensureNonNegative(nHeight) + 'px';
	    else
		if (nAMLResize_resizeEdge & nAMLResize_EDGE_TOP) {
	    	oStyle.height	= fAMLResize_ensureNonNegative(nHeight) + 'px';
	    	oStyle.top		= fAMLResize_ensureNonNegative(nAMLResize_offsetHeight - nHeight + nAMLResize_offsetTop) + 'px';
		}
	}

	// Opera doesn't support userSelect, so manual clearing of ranges is used
	if (!bTrident)
		window.getSelection().removeAllRanges();
};

function fAMLResize_onMouseUp(oEvent)
{
	if (nAMLResize_resizeState == nAMLResize_STATE_RELEASED)
		return;

	if (nAMLResize_resizeState == nAMLResize_STATE_RESIZED)
	{
		// Remove :resize pseudo-class
		fAMLElement_setPseudoClass(oAMLResize_resizeNode, "resize", false);

		// fire onresizeend event
		var oEventResizeEnd	= new cAMLResizeEvent;
	    oEventResizeEnd.initResizeEvent("resizeend", true, true, window, null, nAMLResize_resizeEdge);
	    oEventResizeEnd.$pseudoTarget	= oEvent.$pseudoTarget;
	    fAMLNode_dispatchEvent(oAMLResize_resizeNode, oEventResizeEnd);

		if (oEventResizeEnd.defaultPrevented || (oEvent.defaultPrevented || oEvent.button))
		{
			var oStyle		= oAMLResize_resizeNode.$getContainer().style,
				fRestore	= function() {
				    oStyle.width	= sAMLResize_clientWidth;
				    oStyle.height	= sAMLResize_clientHeight;
					oStyle.left		= sAMLResize_clientLeft;
					oStyle.top		= sAMLResize_clientTop;
				};

		    // Restore element position
			if (oAMLConfiguration_values["ample-enable-animations"]) {
				var oProperties	= {};
				oProperties["left"]		= sAMLResize_clientLeft || "auto";
				oProperties["top"]		= sAMLResize_clientTop || "auto";
				oProperties["width"]	= sAMLResize_clientWidth || "auto";
				oProperties["height"]	= sAMLResize_clientHeight || "auto";
				//
				fAMLNodeAnimation_play(oAMLResize_resizeNode, oProperties, "normal", "ease", fRestore);
			}
			else
				fRestore();
		}

		// End session
		fBrowser_toggleSelect(true);
		if (bTrident)
			oAMLResize_resizeNode.$getContainer().releaseCapture();

		//
		fAMLCapture_releaseCapture(oAMLResize_resizeNode);
	}

    nAMLResize_resizeState	= nAMLResize_STATE_RELEASED;
    // Update position
    nAMLResize_mouseX	= oEvent.clientX;
    nAMLResize_mouseY	= oEvent.clientY;
};

function fAMLResize_onKeyDown(oEvent) {
	if (oEvent.keyIdentifier == "Esc") {
		oEvent.preventDefault();
		fAMLResize_onMouseUp(oEvent);
	}
};

// Utilities
function fAMLResize_getStyleValueNumeric(oStyle, sName, nValue) {
	var vValue	= fParseInt(oStyle[sName]);
	return fIsNaN(vValue) ? nValue || 0 : vValue;
};

function fAMLResize_ensureNonNegative(nValue) {
	return nValue < 0 ? 0 : nValue;
};

function fAMLResize_inScope(nValue, nBorder) {
	return cMath.abs(nValue) < cMath.max(5, nBorder);
};

// Event interfaces
function cAMLResizeEvent(){};
cAMLResizeEvent.prototype	= new cAMLUIEvent;

cAMLResizeEvent.prototype.edge	= null;

// nsIDOMResizeEvent
cAMLResizeEvent.prototype.initResizeEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail, nEdge)
{
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, nDetail);

	//
	this.edge	= nEdge;
};

// Attaching to implementation
// Public Properties
cAMLElement.prototype.$resizable	= false;
cAMLElement.prototype.$resizeEdges	= 0;

// Registering Event Handlers
fAMLEventTarget_addEventListener(oAmple_document, "mousedown",	fAMLResize_onMouseDown,		false);
fAMLEventTarget_addEventListener(oAmple_document, "mousemove",	fAMLResize_onMouseMove,		false);
fAMLEventTarget_addEventListener(oAmple_document, "mouseup",		fAMLResize_onMouseUp,		false);
fAMLEventTarget_addEventListener(oAmple_document, "keydown",		fAMLResize_onKeyDown,		false);
