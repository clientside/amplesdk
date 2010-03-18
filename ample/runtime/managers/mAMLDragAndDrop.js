/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var	nAMLDragAndDrop_STATE_RELEASED	= 0,	// Constants
	nAMLDragAndDrop_STATE_CAPTURED	= 1,
	nAMLDragAndDrop_STATE_DRAGGED	= 2,

	oAMLDragAndDrop_dragSource	= null,		// Variables
	nAMLDragAndDrop_dragState	= nAMLDragAndDrop_STATE_RELEASED,
	aAMLDragAndDrop_dropTargets	= [],
	oAMLDragAndDrop_dropTarget	= null,
	oAMLDragAndDrop_dataTransfer= null,

	nAMLDragAndDrop_mouseX,					// Variables
	nAMLDragAndDrop_mouseY,
	nAMLDragAndDrop_clientLeft,
	nAMLDragAndDrop_clientTop,
	nAMLDragAndDrop_offsetLeft,
	nAMLDragAndDrop_offsetTop;

// Functions
/*
function fAMLDragAndDrop_startSession() {

};

function fAMLDragAndDrop_finishSession() {

};

function fAMLDragAndDrop_abortSession() {

};
*/

// Handlers
function fAMLDragAndDrop_onMouseDown(oEvent)
{
	if (oEvent.defaultPrevented)
		return;

	// Only react on left button
	if (oEvent.button)
		return;

	// if resize kicked in
	if (nAMLResize_resizeState)
		return;

	for (var oElement = oEvent.target; oElement != this; oElement = oElement.parentNode)
	{
		if (oElement.$draggable)
		{
			// Start session
		    nAMLDragAndDrop_dragState	= nAMLDragAndDrop_STATE_CAPTURED;
			oAMLDragAndDrop_dragSource	= oElement;

			return;
		}
	}
};

function fAMLDragAndDrop_onMouseUp(oEvent)
{
	if (nAMLDragAndDrop_dragState == nAMLDragAndDrop_STATE_RELEASED)
		return;

	var oElementDOM	= oAMLDragAndDrop_dragSource.$getContainer();

	if (nAMLDragAndDrop_dragState == nAMLDragAndDrop_STATE_DRAGGED)
	{
		if (oAMLDragAndDrop_dropTarget)
		{
			// fire ondrop event
			if (!oEvent.defaultPrevented && !oEvent.button)
			{
				var oEventDrop	= new cAMLDragEvent;
			    oEventDrop.initDragEvent("drop", true, true, window, null, oAMLDragAndDrop_dataTransfer);
			    oEventDrop.relatedTarget	= oAMLDragAndDrop_dragSource;
			    oEventDrop.$pseudoTarget	= oEvent.$pseudoTarget;
			    fAMLNode_dispatchEvent(oAMLDragAndDrop_dropTarget, oEventDrop);
			}

			// fire ondragleave event
			var oEventDragLeave	= new cAMLDragEvent;
		    oEventDragLeave.initDragEvent("dragleave", true, true, window, null, oAMLDragAndDrop_dataTransfer);
		    oEventDragLeave.$pseudoTarget	= oEvent.$pseudoTarget;
		    oEventDragLeave.relatedTarget	= oAMLDragAndDrop_dragSource;
		    fAMLNode_dispatchEvent(oAMLDragAndDrop_dropTarget, oEventDragLeave);
		}

	    // Clear array of drag target
		aAMLDragAndDrop_dropTargets.length	= 0;

		// fire ondragend event
		var oEventDragEnd	= new cAMLDragEvent;
	    oEventDragEnd.initDragEvent("dragend", true, true, window, null, oAMLDragAndDrop_dataTransfer);
	    oEventDragEnd.$pseudoTarget	= oEvent.$pseudoTarget;
	    fAMLNode_dispatchEvent(oAMLDragAndDrop_dragSource, oEventDragEnd);

		if (oEventDragEnd.defaultPrevented || (oEvent.defaultPrevented || oEvent.button))
		{
			var oStyle		= oElementDOM.style;

		    // Restore element position
			oStyle.left		= nAMLDragAndDrop_clientLeft;
			oStyle.top		= nAMLDragAndDrop_clientTop;
		}

		// End session
		fAML_toggleSelect(true);
		if (bTrident)
			oElementDOM.releaseCapture();

		oAMLDragAndDrop_dragSource.releaseCapture();
	}

	oAMLDragAndDrop_dragSource	= null;
    nAMLDragAndDrop_dragState	= nAMLDragAndDrop_STATE_RELEASED;
	oAMLDragAndDrop_dropTarget	= null;
};

function fAMLDragAndDrop_onMouseMove(oEvent)
{
	if (nAMLDragAndDrop_dragState == nAMLDragAndDrop_STATE_RELEASED)
		return;

   	// Stop event propagation
   	oEvent.stopPropagation();

	var oElementDOM	= oAMLDragAndDrop_dragSource.$getContainer(),
		oPosition	= oAMLDragAndDrop_dragSource.getBoundingClientRect(),
		oStyle		= oElementDOM.style;

	// Turn mode to interactive
    if (nAMLDragAndDrop_dragState == nAMLDragAndDrop_STATE_CAPTURED)
    {
    	// Initialize DataTransfer object
		oAMLDragAndDrop_dataTransfer	= new cAMLDataTransfer;

		// fire ondragstart event
		var oEventDragStart	= new cAMLDragEvent;
		oEventDragStart.initDragEvent("dragstart", true, true, window, null, oAMLDragAndDrop_dataTransfer);
		oEventDragStart.$pseudoTarget	= oEvent.$pseudoTarget;
		fAMLNode_dispatchEvent(oAMLDragAndDrop_dragSource, oEventDragStart);

		if (oEventDragStart.defaultPrevented) {
			// end operation and return
		    nAMLDragAndDrop_dragState	= nAMLDragAndDrop_STATE_RELEASED;
			return;
		}

		// set capture and prevent selection
		fAML_toggleSelect(false);
		if (bTrident)
			oElementDOM.setCapture();

		oAMLDragAndDrop_dragSource.setCapture(true);


		// fill in array with drag targets
		var aElements	= (oAML_modalNode || this).getElementsByTagName('*');
		for (var nIndex = 0, nLength = aElements.length; nIndex < nLength; nIndex++)
			if (aElements[nIndex].$droppable)
				aAMLDragAndDrop_dropTargets.push(aElements[nIndex]);

	    //
    	nAMLDragAndDrop_dragState	= nAMLDragAndDrop_STATE_DRAGGED;

		// Init session
	    nAMLDragAndDrop_mouseX	= oEvent.clientX;
	    nAMLDragAndDrop_mouseY	= oEvent.clientY;

		// Save current position
		nAMLDragAndDrop_clientLeft		= oStyle.left;
		nAMLDragAndDrop_clientTop		= oStyle.top;

		// move drag source position to (0, 0)
		oStyle.left	= '0';
		oStyle.top	= '0';

		// get drag source position at (0, 0)
		var oPositionP	= oAMLDragAndDrop_dragSource.getBoundingClientRect();

		// restore drag source position
		oStyle.left	= nAMLDragAndDrop_clientLeft;
		oStyle.top	= nAMLDragAndDrop_clientTop;

		// calculate offset position
	    nAMLDragAndDrop_offsetLeft	= oPosition.left - oPositionP.left;
	    nAMLDragAndDrop_offsetTop	= oPosition.top - oPositionP.top;
	}

	var nTarget	=-1,
		oPosition2,
		nAreaSource	=(oPosition.right - oPosition.left) * (oPosition.bottom - oPosition.top),
		nAreaSourceMax	= 0,
		nAreaTarget,
		nAreaTargetMin	= Infinity,
		nIntersection,
		nIntersectionPartialMax	= 0;

	for (var nIndex = 0, nLength = aAMLDragAndDrop_dropTargets.length; nIndex < nLength; nIndex++)
	{
		// if source is the target, continue
		if (aAMLDragAndDrop_dropTargets[nIndex] == oAMLDragAndDrop_dragSource)
			continue;

		// if target contains source, continue
		if (aAMLDragAndDrop_dropTargets[nIndex].compareDocumentPosition(oAMLDragAndDrop_dragSource) & cAMLNode.DOCUMENT_POSITION_CONTAINS)
			continue;

		oPosition2	= aAMLDragAndDrop_dropTargets[nIndex].getBoundingClientRect();
		nAreaTarget =(oPosition2.right - oPosition2.left) * (oPosition2.bottom - oPosition2.top);
		nIntersection = fAMLDragAndDrop_intersectRectangle(oPosition, oPosition2);
		if (nIntersection < nAreaSource) {
			// partial intersection
			if (nIntersection > nIntersectionPartialMax) {
				nIntersectionPartialMax	= nIntersection;
				nTarget	= nIndex;
			}
		}
		else {
			// complete intersection
			if (nAreaTarget < nAreaTargetMin) {
				nAreaTargetMin	= nAreaTarget;
				nTarget	= nIndex;
			}
		}
	}

	// if there was a drop target and it is different from a new one
	if (oAMLDragAndDrop_dropTarget && (nTarget < 0 || aAMLDragAndDrop_dropTargets[nTarget] != oAMLDragAndDrop_dropTarget)) {
		// fire ondragleave event
		var oEventDragLeave	= new cAMLDragEvent;
	    oEventDragLeave.initDragEvent("dragleave", true, true, window, null, oAMLDragAndDrop_dataTransfer);
	    oEventDragLeave.relatedTarget	= oAMLDragAndDrop_dragSource;
	    oEventDragLeave.$pseudoTarget	= oEvent.$pseudoTarget;
	    fAMLNode_dispatchEvent(oAMLDragAndDrop_dropTarget, oEventDragLeave);
	}

	if (nTarget >-1)
	{
		if (aAMLDragAndDrop_dropTargets[nTarget] != oAMLDragAndDrop_dropTarget)
		{
			oAMLDragAndDrop_dropTarget	= aAMLDragAndDrop_dropTargets[nTarget];

			// fire ondragenter event
			var oEventDragEnter	= new cAMLDragEvent;
		    oEventDragEnter.initDragEvent("dragenter", true, true, window, null, oAMLDragAndDrop_dataTransfer);
		    oEventDragEnter.$pseudoTarget	= oEvent.$pseudoTarget;
		    oEventDragEnter.relatedTarget	= oAMLDragAndDrop_dragSource;
		    fAMLNode_dispatchEvent(oAMLDragAndDrop_dropTarget, oEventDragEnter);
		}

		// fire ondragover event
		var oEventDragOver	= new cAMLDragEvent;
	    oEventDragOver.initDragEvent("dragover", true, true, window, null, oAMLDragAndDrop_dataTransfer);
	    oEventDragOver.$pseudoTarget	= oEvent.$pseudoTarget;
	    oEventDragOver.relatedTarget	= oAMLDragAndDrop_dragSource;
	    fAMLNode_dispatchEvent(oAMLDragAndDrop_dropTarget, oEventDragOver);
	}
	else
	{
		oAMLDragAndDrop_dropTarget	= null;
	}

	// fire ondrag event
	var oEventDrag	= new cAMLDragEvent;
    oEventDrag.initDragEvent("drag", true, true, window, null, oAMLDragAndDrop_dataTransfer);
    oEventDrag.$pseudoTarget	= oEvent.$pseudoTarget;
    oEventDrag.relatedTarget	= oAMLDragAndDrop_dropTarget;
    fAMLNode_dispatchEvent(oAMLDragAndDrop_dragSource, oEventDrag);

	if (!oEventDrag.defaultPrevented)
	{
		// Display dragged element
	    oStyle.left	= nAMLDragAndDrop_offsetLeft + (oEvent.clientX - nAMLDragAndDrop_mouseX) + "px";
	    oStyle.top	= nAMLDragAndDrop_offsetTop + (oEvent.clientY - nAMLDragAndDrop_mouseY) + "px";
	}

	// Opera doesn't support userSelect, so manual clearing of ranges is used
	if (bPresto)
		window.getSelection().removeAllRanges();
};

function fAMLDragAndDrop_onKeyDown(oEvent) {
	if (oEvent.keyIdentifier == "Esc") {
		oEvent.preventDefault();
		fAMLDragAndDrop_onMouseUp(oEvent);
	}
};

function fAMLDragAndDrop_intersectRectangle(oPosition1, oPosition2)
{
    return fAMLDragAndDrop_intersectSegment(oPosition1.left, oPosition1.right - oPosition1.left, oPosition2.left, oPosition2.right - oPosition2.left) * fAMLDragAndDrop_intersectSegment(oPosition1.top, oPosition1.bottom - oPosition1.top, oPosition2.top, oPosition2.bottom - oPosition2.top);
};

function fAMLDragAndDrop_intersectSegment(x, y, a, b)
{
	return a > x ? (a <= x + y ? a + b < x + y ? b : x + y - a : 0) : (a >= x - b ? a + b < x + y ? a + b - x : y : 0);
};

// Event interfaces
var cAMLDragEvent	= function(){};
cAMLDragEvent.prototype	= new cAMLUIEvent;

// nsIDOMDragEvent
cAMLDragEvent.prototype.dataTransfer	= null;

cAMLDragEvent.prototype.initDragEvent	= function(sType, bCanBubble, bCancelable, oView, nDetail, oDataTransfer)
{
	this.initUIEvent(sType, bCanBubble, bCancelable, oView, nDetail);

	//
	this.dataTransfer	= oDataTransfer;
};

cAMLDragEvent.prototype.getModifierState	= function(sModifier)
{
	switch (sModifier) {
		case "Alt":		return this.altKey;
		case "Control":	return this.ctrlKey;
		case "Meta":	return this.metaKey;
		case "Shift":	return this.shiftKey;
	}
	return false;
};

//
var cAMLDataTransfer	= function(){
	this.types	= [];
};
cAMLDataTransfer.prototype.dropEffect		= "none";
cAMLDataTransfer.prototype.effectAllowed	= "uninitialized";
cAMLDataTransfer.prototype.types			= null;

cAMLDataTransfer.prototype.clearData	= function(sFormat) {
	delete this.types[sFormat];
};

cAMLDataTransfer.prototype.setData	= function(sFormat, sData) {
	this.types[sFormat]	= sData;
};

cAMLDataTransfer.prototype.getData	= function(sFormat) {
	return this.types[sFormat] || null;
};

cAMLDataTransfer.prototype.setDragImage	= function(oImage, nLeft, nTop) {

};

cAMLDataTransfer.prototype.addElement		= function(oElement) {

};

// Attaching to impementation
cAMLElement.prototype.$draggable	= false;
cAMLElement.prototype.$droppable	= false;

// Registering Event Handlers
fAMLEventTarget_addEventListener(oAML_document, "mousedown",	fAMLDragAndDrop_onMouseDown,	false);
fAMLEventTarget_addEventListener(oAML_document, "mousemove",	fAMLDragAndDrop_onMouseMove,	true);
fAMLEventTarget_addEventListener(oAML_document, "mouseup",		fAMLDragAndDrop_onMouseUp,		false);
fAMLEventTarget_addEventListener(oAML_document, "keydown",		fAMLDragAndDrop_onKeyDown,		false);
