/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var nAMLDragAndDrop_STATE_RELEASED	= 0,	// Constants
	nAMLDragAndDrop_STATE_CAPTURED	= 1,
	nAMLDragAndDrop_STATE_DRAGGED	= 2,

	oAMLDragAndDrop_dragSource	= null,		// Variables
	nAMLDragAndDrop_dragState	= nAMLDragAndDrop_STATE_RELEASED,
	aAMLDragAndDrop_dropTargets	= [],
	oAMLDragAndDrop_dropTarget	= null,
	oAMLDragAndDrop_dataTransfer= null,
	oAMLDragAndDrop_image	= null,

	nAMLDragAndDrop_mouseX,					// Variables
	nAMLDragAndDrop_mouseY,
	sAMLDragAndDrop_clientLeft,
	sAMLDragAndDrop_clientTop,
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

		    // Simulate initial mousemove event
			fSetTimeout(function() {
				fAMLDragAndDrop_onMouseMove.call(oEvent.currentTarget, oEvent);
			}, 0);

			return;
		}
	}
};

function fAMLDragAndDrop_onMouseUp(oEvent)
{
	if (nAMLDragAndDrop_dragState == nAMLDragAndDrop_STATE_RELEASED)
		return;

	var oElementDOM	= oAMLDragAndDrop_dragSource.$getContainer(),
		oRect0	= fAMLElement_getBoundingClientRect(oAMLDragAndDrop_dragSource);

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

			// Remove :drop pseudo-class
			fAMLElement_setPseudoClass(oAMLDragAndDrop_dropTarget, "drop", false);

			// fire ondragleave event
			var oEventDragLeave	= new cAMLDragEvent;
		    oEventDragLeave.initDragEvent("dragleave", true, true, window, null, oAMLDragAndDrop_dataTransfer);
		    oEventDragLeave.$pseudoTarget	= oEvent.$pseudoTarget;
		    oEventDragLeave.relatedTarget	= oAMLDragAndDrop_dragSource;
		    fAMLNode_dispatchEvent(oAMLDragAndDrop_dropTarget, oEventDragLeave);
		}

	    // Clear array of drag target
		aAMLDragAndDrop_dropTargets.length	= 0;

		// Remove :drag pseudo-class
		fAMLElement_setPseudoClass(oAMLDragAndDrop_dragSource, "drag", false);

		// fire ondragend event
		var oEventDragEnd	= new cAMLDragEvent;
	    oEventDragEnd.initDragEvent("dragend", true, true, window, null, oAMLDragAndDrop_dataTransfer);
	    oEventDragEnd.$pseudoTarget	= oEvent.$pseudoTarget;
	    fAMLNode_dispatchEvent(oAMLDragAndDrop_dragSource, oEventDragEnd);

	    var bDefaultPrevented	= oEvent.defaultPrevented || oEvent.button || oEventDragEnd.defaultPrevented,
	    	bPlay	= oAMLConfiguration_values["ample-enable-animations"] &&(bDefaultPrevented || oAMLDragAndDrop_dataTransfer.dropEffect == "move" || oAMLDragAndDrop_dataTransfer.dropEffect == "copy");
	    if (bPlay) {
	    	var oRect	= fAMLElement_getBoundingClientRect(oAMLDragAndDrop_dragSource),
	    		sLeft	=(oRect0.left - oRect.left + fParseInt(oElementDOM.style.left)) + 'px',
		    	sTop	=(oRect0.top - oRect.top + fParseInt(oElementDOM.style.top)) + 'px';
		    // Commit
		    oElementDOM.style.left	= sAMLDragAndDrop_clientLeft;
		    oElementDOM.style.top	= sAMLDragAndDrop_clientTop;
	    	var oRect1	= fAMLElement_getBoundingClientRect(oAMLDragAndDrop_dragSource);
	    	// Rollback
		    oElementDOM.style.left	= sLeft;
		    oElementDOM.style.top	= sTop;
	    }

	    // Execute default action
	    if (!bDefaultPrevented && oAMLDragAndDrop_dropTarget && oAMLDragAndDrop_dropTarget != oAMLDragAndDrop_dragSource.parentNode) {
		    if (oAMLDragAndDrop_dataTransfer.dropEffect == "copy")
		    	fAMLElement_appendChild(oAMLDragAndDrop_dropTarget, fAMLNode_cloneNode(oAMLDragAndDrop_dragSource, true));	// TODO: remove @id attribute values
		    else
		    if (oAMLDragAndDrop_dataTransfer.dropEffect == "move")
		    	fAMLElement_appendChild(oAMLDragAndDrop_dropTarget, oAMLDragAndDrop_dragSource);
	    }

		if (bDefaultPrevented || oAMLDragAndDrop_dataTransfer.dropEffect == "move" || oAMLDragAndDrop_dataTransfer.dropEffect == "copy")
		{
			var oStyle		= oElementDOM.style,
				fRestore	= function() {
					oStyle.left		= sAMLDragAndDrop_clientLeft;
					oStyle.top		= sAMLDragAndDrop_clientTop;
				};

		    // Restore element position
			if (bPlay) {
				// Commit
				oStyle.left	= sAMLDragAndDrop_clientLeft;
				oStyle.top	= sAMLDragAndDrop_clientTop;
				var oRect2	= fAMLElement_getBoundingClientRect(oAMLDragAndDrop_dragSource);
				// Rollback
				oStyle.left	=(fParseInt(sLeft) + oRect1.left - oRect2.left)+ 'px';
				oStyle.top	=(fParseInt(sTop) + oRect1.top - oRect2.top)+ 'px';
				//
				var oProperties	= {};
				oProperties["left"]		= sAMLDragAndDrop_clientLeft || "auto";
				oProperties["top"]		= sAMLDragAndDrop_clientTop || "auto";

				fAMLNodeAnimation_play(oAMLDragAndDrop_dragSource, oProperties, "normal", "ease", fRestore);
			}
			else
				fRestore();
		}

		// End session
		fBrowser_toggleSelect(true);
		if (bTrident)
			oElementDOM.releaseCapture();

		//
		fAMLCapture_releaseCapture(oAMLDragAndDrop_dragSource);

		// Hide drag image
		oAMLDragAndDrop_image.innerHTML	= '';
		oAMLDragAndDrop_image.style.display	= "none";
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
		oRect	= fAMLElement_getBoundingClientRect(oAMLDragAndDrop_dragSource),
		oStyle	= oElementDOM.style;

	// Turn mode to interactive
    if (nAMLDragAndDrop_dragState == nAMLDragAndDrop_STATE_CAPTURED)
    {
    	// Initialize DataTransfer object
		oAMLDragAndDrop_dataTransfer	= new cAMLDataTransfer;

		// Initialize drag image container
		if (!oAMLDragAndDrop_image) {
			oAMLDragAndDrop_image	= oBrowser_body.appendChild(oUADocument.createElement("div"));
			oAMLDragAndDrop_image.style.cssText	= 'z-index:1000;position:absolute;display:none';
		}

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

		// Save current position
		sAMLDragAndDrop_clientLeft		= oStyle.left;
		sAMLDragAndDrop_clientTop		= oStyle.top;

		// Add :drag pseudo-class
		fAMLElement_setPseudoClass(oAMLDragAndDrop_dragSource, "drag", true);

		// set capture and prevent selection
		fBrowser_toggleSelect(false);
		if (bTrident)
			oElementDOM.setCapture();
		fAMLCapture_setCapture(oAMLDragAndDrop_dragSource, true);

		// Show drag image
		oAMLDragAndDrop_image.style.display	= '';

		// fill in array with drag targets
		var aElements	= fAMLElement_getElementsByTagName(oBrowser_modalNode || this.documentElement, '*');
		for (var nIndex = 0, nLength = aElements.length; nIndex < nLength; nIndex++)
			if (aElements[nIndex].$droppable)
				aAMLDragAndDrop_dropTargets.push(aElements[nIndex]);

	    //
    	nAMLDragAndDrop_dragState	= nAMLDragAndDrop_STATE_DRAGGED;

		// Init session
	    nAMLDragAndDrop_mouseX	= oEvent.clientX;
	    nAMLDragAndDrop_mouseY	= oEvent.clientY;

		// move drag source position to (0, 0)
		oStyle.left	= 0;
		oStyle.top	= 0;

		// get drag source position at (0, 0)
		var oRect0	= fAMLElement_getBoundingClientRect(oAMLDragAndDrop_dragSource);

		// restore drag source position
		oStyle.left	= sAMLDragAndDrop_clientLeft;
		oStyle.top	= sAMLDragAndDrop_clientTop;

		// calculate offset position
	    nAMLDragAndDrop_offsetLeft	= oRect.left - oRect0.left;
	    nAMLDragAndDrop_offsetTop	= oRect.top - oRect0.top;
	}

	var oDropTarget	= null,
		oRect2,
		nAreaSource	=(oRect.right - oRect.left) * (oRect.bottom - oRect.top),
		nAreaSourceMax	= 0,
		nAreaTarget,
		nAreaTargetMin	= nInfinity,
		nIntersection,
		nPartialMax	= 0;

	for (var nIndex = 0, nLength = aAMLDragAndDrop_dropTargets.length; nIndex < nLength; nIndex++)
	{
		// if source is the target, continue
		if (aAMLDragAndDrop_dropTargets[nIndex] == oAMLDragAndDrop_dragSource)
			continue;

		// if target contains source, continue
		if (fAMLNode_compareDocumentPosition(aAMLDragAndDrop_dropTargets[nIndex], oAMLDragAndDrop_dragSource) & cAMLNode.DOCUMENT_POSITION_CONTAINS)
			continue;

		oRect2	= fAMLElement_getBoundingClientRect(aAMLDragAndDrop_dropTargets[nIndex]);
		nAreaTarget =(oRect2.right - oRect2.left) * (oRect2.bottom - oRect2.top);
		nIntersection = fAMLDragAndDrop_intersectRectangle(oRect, oRect2);
		if (nIntersection < nAreaSource) {
			// partial intersection
			if (nIntersection > nPartialMax) {
				nPartialMax	= nIntersection;
				oDropTarget	= aAMLDragAndDrop_dropTargets[nIndex];
			}
		}
		else {
			// complete intersection
			if (nAreaTarget < nAreaTargetMin) {
				nAreaTargetMin	= nAreaTarget;
				oDropTarget	= aAMLDragAndDrop_dropTargets[nIndex];
			}
		}
	}

	// if there was a drop target and it is different from a new one
	if (oAMLDragAndDrop_dropTarget)
	{
		if (oAMLDragAndDrop_dropTarget != oDropTarget)
		{
			// Remove :drop pseudo-class
			fAMLElement_setPseudoClass(oAMLDragAndDrop_dropTarget, "drop", false);
			// fire ondragleave event
			var oEventDragLeave	= new cAMLDragEvent;
		    oEventDragLeave.initDragEvent("dragleave", true, true, window, null, oAMLDragAndDrop_dataTransfer);
		    oEventDragLeave.relatedTarget	= oAMLDragAndDrop_dragSource;
		    oEventDragLeave.$pseudoTarget	= oEvent.$pseudoTarget;
		    fAMLNode_dispatchEvent(oAMLDragAndDrop_dropTarget, oEventDragLeave);
		}
	}

	// fire ondrag event
	var oEventDrag	= new cAMLDragEvent;
    oEventDrag.initDragEvent("drag", true, true, window, null, oAMLDragAndDrop_dataTransfer);
    oEventDrag.$pseudoTarget	= oEvent.$pseudoTarget;
    oEventDrag.relatedTarget	= oDropTarget;
    fAMLNode_dispatchEvent(oAMLDragAndDrop_dragSource, oEventDrag);

    if (!oEventDrag.defaultPrevented)
	{
		// Display dragged element
	    oStyle.left	= nAMLDragAndDrop_offsetLeft + (oEvent.clientX - nAMLDragAndDrop_mouseX) + 'px';
	    oStyle.top	= nAMLDragAndDrop_offsetTop + (oEvent.clientY - nAMLDragAndDrop_mouseY) + 'px';
	}

    if (oAMLDragAndDrop_image) {
    	oAMLDragAndDrop_image.style.left	= oEvent.clientX + 'px';
    	oAMLDragAndDrop_image.style.top		= oEvent.clientY + 'px';
    }

	//
	if (oDropTarget)
	{
		if (oDropTarget != oAMLDragAndDrop_dropTarget)
		{
			// Add :drop pseudo-class
			fAMLElement_setPseudoClass(oDropTarget, "drop", true);
			// fire ondragenter event
			var oEventDragEnter	= new cAMLDragEvent;
		    oEventDragEnter.initDragEvent("dragenter", true, true, window, null, oAMLDragAndDrop_dataTransfer);
		    oEventDragEnter.$pseudoTarget	= oEvent.$pseudoTarget;
		    oEventDragEnter.relatedTarget	= oAMLDragAndDrop_dragSource;
		    fAMLNode_dispatchEvent(oDropTarget, oEventDragEnter);
		}

		// fire ondragover event
		var oEventDragOver	= new cAMLDragEvent;
	    oEventDragOver.initDragEvent("dragover", true, true, window, null, oAMLDragAndDrop_dataTransfer);
	    oEventDragOver.$pseudoTarget	= oEvent.$pseudoTarget;
	    oEventDragOver.relatedTarget	= oAMLDragAndDrop_dragSource;
	    fAMLNode_dispatchEvent(oDropTarget, oEventDragOver);
	}

	oAMLDragAndDrop_dropTarget	= oDropTarget;

	// Opera doesn't support userSelect, so manual clearing of ranges is used
	if (!bTrident)
		window.getSelection().removeAllRanges();
};

function fAMLDragAndDrop_onKeyDown(oEvent) {
	if (oEvent.keyIdentifier == "Esc") {
		oEvent.preventDefault();
		fAMLDragAndDrop_onMouseUp(oEvent);	// TODO: object with Keyboard interface passing to a function expecting MouseEvent interface
	}
};

function fAMLDragAndDrop_intersectRectangle(oRect1, oRect2)
{
    return fAMLDragAndDrop_intersectSegment(oRect1.left, oRect1.right - oRect1.left, oRect2.left, oRect2.right - oRect2.left) * fAMLDragAndDrop_intersectSegment(oRect1.top, oRect1.bottom - oRect1.top, oRect2.top, oRect2.bottom - oRect2.top);
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
var cAMLDataTransfer	= function() {
	this.types	= new cAMLStringList;
};
cAMLDataTransfer.prototype.dropEffect		= "none";			// copy|move|link|position|none (dragenter|dragover)
cAMLDataTransfer.prototype.effectAllowed	= "uninitialized";	// copy|move|link|copyLink|copyMove|linkMove|all|none|uninitialized=all (dragstart|dragenter|dragover)
cAMLDataTransfer.prototype.types			= null;

cAMLDataTransfer.prototype.clearData	= function(sFormat) {
	// Validate arguments
	fGuard(arguments, [
		["format",	cString]
	]);

	delete this.types[sFormat];
};

cAMLDataTransfer.prototype.setData	= function(sFormat, vData) {
	// Validate arguments
	fGuard(arguments, [
		["format",	cString],
		["data",	cString]
	]);

	this.types[sFormat]	= vData;
};

cAMLDataTransfer.prototype.getData	= function(sFormat) {
	// Validate arguments
	fGuard(arguments, [
		["format",	cString]
	]);

	return this.types[sFormat] || null;
};

cAMLDataTransfer.prototype.setDragImage	= function(oImage, nLeft, nTop) {
	// Validate arguments
	fGuard(arguments, [
		["image",	cXMLElement],
		["left",	cNumber,	true],
		["top",		cNumber,	true]
	]);

	oAMLDragAndDrop_image.appendChild(oImage);
	oAMLDragAndDrop_image.style.marginLeft	= (nLeft || 0) + 'px';
	oAMLDragAndDrop_image.style.marginTop	= (nTop || 0) + 'px';
};

cAMLDataTransfer.prototype.addElement		= function(oElement) {
	// Validate arguments
	fGuard(arguments, [
		["element",	cXMLElement]
	]);

	oAMLDragAndDrop_image.appendChild(oElement);
};

// Attaching to implementation
cAMLElement.prototype.$draggable	= false;
cAMLElement.prototype.$droppable	= false;

// Registering Event Handlers
fAMLEventTarget_addEventListener(oAmple_document, "mousedown",	fAMLDragAndDrop_onMouseDown,	false);
fAMLEventTarget_addEventListener(oAmple_document, "mousemove",	fAMLDragAndDrop_onMouseMove,	false);
fAMLEventTarget_addEventListener(oAmple_document, "mouseup",		fAMLDragAndDrop_onMouseUp,		false);
fAMLEventTarget_addEventListener(oAmple_document, "keydown",		fAMLDragAndDrop_onKeyDown,		false);
