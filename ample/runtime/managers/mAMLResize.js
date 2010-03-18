/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var	nAMLResize_STATE_RELEASED	= 0,	// Constants
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
	nAMLResize_clientLeft,
	nAMLResize_clientTop,
	nAMLResize_clientHeight,
	nAMLResize_clientWidth,
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

		oAMLResize_resizeNode.setCapture(true);

		return;
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
					oPosition	= oElement.getBoundingClientRect(),
					oComputedStyle	= fAML_getComputedStyle(oElementDOM),
					nResize		= nAMLResize_EDGE_NONE,
					nResizeEdges= oElement.$resizeEdges || 15,
					sCursor		= '';

				var nOffsetLeft	= nAMLResize_mouseX - oPosition.left/* + oPosition.scrollLeft*/,
					nOffsetTop	= nAMLResize_mouseY - oPosition.top/* + oPosition.scrollTop*/;

				// Vertical
				if (fAMLResize_inScope(nOffsetTop, fAMLResize_getStyleValueNumeric(oComputedStyle, "borderTopWidth")))
				{
					nResize|= nResizeEdges & nAMLResize_EDGE_TOP;
					sCursor+= 'n';
				}
				else
				if (fAMLResize_inScope(nOffsetTop - oPosition.bottom + oPosition.top, fAMLResize_getStyleValueNumeric(oComputedStyle, "borderBottomWidth")))
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
				if (fAMLResize_inScope(nOffsetLeft - oPosition.right + oPosition.left, fAMLResize_getStyleValueNumeric(oComputedStyle, "borderRightWidth")))
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
		oPosition	= oAMLResize_resizeNode.getBoundingClientRect(),
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

		// set capture and prevent selection
		fAML_toggleSelect(false);
		if (bTrident)
			oAMLResize_resizeNode.$getContainer().setCapture();

		// Save current position
		nAMLResize_clientWidth		= oStyle.width;
		nAMLResize_clientHeight		= oStyle.height;
		nAMLResize_clientLeft		= oStyle.left;
		nAMLResize_clientTop		= oStyle.top;

		var oComputedStyle	= fAML_getComputedStyle(oElementDOM),
			bBackCompat		= oUADocument.compatMode == "BackCompat";

		// move resizable position to (0, 0)
		oStyle.left	= '0';
		oStyle.top	= '0';

		// get resizable position at (0, 0)
		var oPositionP	= oAMLResize_resizeNode.getBoundingClientRect();

		// restore resizable position
		oStyle.left	= nAMLResize_clientLeft;
		oStyle.top	= nAMLResize_clientTop;

	    //
    	nAMLResize_resizeState	= nAMLResize_STATE_RESIZED;

	    nAMLResize_offsetWidth		=(oPosition.right - oPosition.left)	-(bBackCompat ? 0 : (fAMLResize_getStyleValueNumeric(oComputedStyle, "borderLeftWidth") + fAMLResize_getStyleValueNumeric(oComputedStyle, "borderRightWidth")) + fAMLResize_getStyleValueNumeric(oComputedStyle, "paddingLeft") + fAMLResize_getStyleValueNumeric(oComputedStyle, "paddingRight"));
	    nAMLResize_offsetHeight		=(oPosition.bottom - oPosition.top)	-(bBackCompat ? 0 : (fAMLResize_getStyleValueNumeric(oComputedStyle, "borderTopWidth") + fAMLResize_getStyleValueNumeric(oComputedStyle, "borderBottomWidth")) + fAMLResize_getStyleValueNumeric(oComputedStyle, "paddingTop") + fAMLResize_getStyleValueNumeric(oComputedStyle, "paddingBottom"));
	    nAMLResize_offsetLeft		= oPosition.left	- oPositionP.left;
	    nAMLResize_offsetTop		= oPosition.top		- oPositionP.top;

		// Retrieve min/max allowed hight/width
		nAMLResize_widthMin		= fParseInt(oComputedStyle[fAML_toCssPropertyName("min-width")] || oComputedStyle["min-width"]) || 0;
		nAMLResize_widthMax		= fParseInt(oComputedStyle[fAML_toCssPropertyName("max-width")] || oComputedStyle["max-width"]) || nInfinity;
		nAMLResize_heightMin	= fParseInt(oComputedStyle[fAML_toCssPropertyName("min-height")]|| oComputedStyle["min-height"]) || 0;
		nAMLResize_heightMax	= fParseInt(oComputedStyle[fAML_toCssPropertyName("max-height")]|| oComputedStyle["max-height"]) || nInfinity;
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
    		oStyle.width	= fAMLResize_ensureNonNegative(nWidth) + "px";
	    else
		if (nAMLResize_resizeEdge & nAMLResize_EDGE_LEFT) {
			oStyle.width	= fAMLResize_ensureNonNegative(nWidth) + "px";
			oStyle.left		= fAMLResize_ensureNonNegative(nAMLResize_offsetWidth - nWidth + nAMLResize_offsetLeft) + "px";
		}

		// Vertical resize
		if (nHeight <= nAMLResize_heightMin)
			nHeight	= nAMLResize_heightMin;
		else
		if (nHeight >= nAMLResize_heightMax)
			nHeight	= nAMLResize_heightMax;
		// Set
		if (nAMLResize_resizeEdge & nAMLResize_EDGE_BOTTOM)
	    	oStyle.height	= fAMLResize_ensureNonNegative(nHeight) + "px";
	    else
		if (nAMLResize_resizeEdge & nAMLResize_EDGE_TOP) {
	    	oStyle.height	= fAMLResize_ensureNonNegative(nHeight) + "px";
	    	oStyle.top		= fAMLResize_ensureNonNegative(nAMLResize_offsetHeight - nHeight + nAMLResize_offsetTop) + "px";
		}
	}

	// Opera doesn't support userSelect, so manual clearing of ranges is used
	if (bPresto)
		window.getSelection().removeAllRanges();
};

function fAMLResize_onMouseUp(oEvent)
{
	if (nAMLResize_resizeState == nAMLResize_STATE_RELEASED)
		return;

	if (nAMLResize_resizeState == nAMLResize_STATE_RESIZED)
	{
		// fire onresizeend event
		var oEventResizeEnd	= new cAMLResizeEvent;
	    oEventResizeEnd.initResizeEvent("resizeend", true, true, window, null, nAMLResize_resizeEdge);
	    oEventResizeEnd.$pseudoTarget	= oEvent.$pseudoTarget;
	    fAMLNode_dispatchEvent(oAMLResize_resizeNode, oEventResizeEnd);

		if (oEventResizeEnd.defaultPrevented || (oEvent.defaultPrevented || oEvent.button))
		{
			var oStyle		= oAMLResize_resizeNode.$getContainer().style;

		    // Restore element position
		    oStyle.width	= nAMLResize_clientWidth;
		    oStyle.height	= nAMLResize_clientHeight;
			oStyle.left		= nAMLResize_clientLeft;
			oStyle.top		= nAMLResize_clientTop;
		}

		// End session
		fAML_toggleSelect(true);
		if (bTrident)
			oAMLResize_resizeNode.$getContainer().releaseCapture();

		oAMLResize_resizeNode.releaseCapture();
	}

    nAMLResize_resizeState	= nAMLResize_STATE_RELEASED;
	oAMLResize_resizeNode	= null;

	// reset cursor
	oUADocument.documentElement.style.cursor	= '';
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
var cAMLResizeEvent	= function(){};
cAMLResizeEvent.prototype	= new cAMLUIEvent;

cAMLResizeEvent.prototype.edge	= null;

// nsIDOMResizeEvent
cAMLResizeEvent.prototype.initResizeEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail, nEdge)
{
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, nDetail);

	//
	this.edge	= nEdge;
};

// Attaching to impementation
// Public Properties
cAMLElement.prototype.$resizable	= false;
cAMLElement.prototype.$resizeEdges	= 0;

// Registering Event Handlers
ample.addEventListener("mousedown",	fAMLResize_onMouseDown,		false);
ample.addEventListener("mousemove", fAMLResize_onMouseMove,		true);
ample.addEventListener("mouseup", 	fAMLResize_onMouseUp,		false);
ample.addEventListener("keydown",	fAMLResize_onKeyDown,		false);
