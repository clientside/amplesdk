/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var nDragAndDropManager_STATE_RELEASED	= 0,	// Constants
	nDragAndDropManager_STATE_CAPTURED	= 1,
	nDragAndDropManager_STATE_DRAGGED	= 2,

	oDragAndDropManager_dragSource	= null,		// Variables
	nDragAndDropManager_dragState	= nDragAndDropManager_STATE_RELEASED,
	aDragAndDropManager_dropTargets	= [],
	oDragAndDropManager_dropTarget	= null,
	oDragAndDropManager_dataTransfer= null,
	oDragAndDropManager_image	= null,

	nDragAndDropManager_timeout,

	nDragAndDropManager_mouseX,					// Variables
	nDragAndDropManager_mouseY,
	sDragAndDropManager_originalLeft,
	sDragAndDropManager_originalTop,
	nDragAndDropManager_scrollLeft,
	nDragAndDropManager_scrollTop,
	nDragAndDropManager_offsetLeft,
	nDragAndDropManager_offsetTop;

// Functions
/*
function fDragAndDropManager_startSession() {

};

function fDragAndDropManager_finishSession() {

};

function fDragAndDropManager_abortSession() {

};
*/

// Handlers
function fDragAndDropManager_onMouseDown(oEvent) {
	if (oEvent.defaultPrevented || oEvent.button)
		return;

	// if resize kicked in
	if (nResizeManager_resizeState)
		return;

	for (var oElement = oEvent.target; oElement != this; oElement = oElement.parentNode) {
		if (oElement.$draggable) {
			// Start session
			nDragAndDropManager_dragState	= nDragAndDropManager_STATE_CAPTURED;
			oDragAndDropManager_dragSource	= oElement;

			// Simulate initial mousemove event
			nDragAndDropManager_timeout	= fSetTimeout(function() {
				nDragAndDropManager_timeout	= 0;
				//
				fDragAndDropManager_onMouseMove.call(oEvent.currentTarget, oEvent);
			}, 200);

			return;
		}
	}
};

function fDragAndDropManager_onMouseUp(oEvent) {
	if (nDragAndDropManager_dragState == nDragAndDropManager_STATE_RELEASED)
		return;

	// Clear timeout
	if (nDragAndDropManager_timeout)
		nDragAndDropManager_timeout	= fClearTimeout(nDragAndDropManager_timeout);

	var oElementDOM	= oDragAndDropManager_dragSource.$getContainer(),
		bDropPrevented	= false,
		oRect0	= fElement_getBoundingClientRect(oDragAndDropManager_dragSource);

	if (nDragAndDropManager_dragState == nDragAndDropManager_STATE_DRAGGED) {
		if (oDragAndDropManager_dropTarget) {
			// fire ondrop event
			if (!oEvent.defaultPrevented && !oEvent.button) {
				var oEventDrop	= new cDragEvent;
				oEventDrop.initDragEvent("drop", true, true, window, null, oDragAndDropManager_dataTransfer);
				oEventDrop.relatedTarget	= oDragAndDropManager_dragSource;
				oEventDrop.$pseudoTarget	= oEvent.$pseudoTarget;
				bDropPrevented	= !fEventTarget_dispatchEvent(oDragAndDropManager_dropTarget, oEventDrop);
			}

			// Remove :drop pseudo-class
			fElement_setPseudoClass(oDragAndDropManager_dropTarget, "drop", false);

			// fire ondragleave event
			var oEventDragLeave	= new cDragEvent;
			oEventDragLeave.initDragEvent("dragleave", true, true, window, null, oDragAndDropManager_dataTransfer);
			oEventDragLeave.$pseudoTarget	= oEvent.$pseudoTarget;
			oEventDragLeave.relatedTarget	= oDragAndDropManager_dragSource;
			fEventTarget_dispatchEvent(oDragAndDropManager_dropTarget, oEventDragLeave);
		}

		// Clear array of drag target
		aDragAndDropManager_dropTargets.length	= 0;

		// Remove :drag pseudo-class
		fElement_setPseudoClass(oDragAndDropManager_dragSource, "drag", false);

		// fire ondragend event
		var oEventDragEnd	= new cDragEvent;
		oEventDragEnd.initDragEvent("dragend", true, true, window, null, oDragAndDropManager_dataTransfer);
		oEventDragEnd.$pseudoTarget	= oEvent.$pseudoTarget;
		fEventTarget_dispatchEvent(oDragAndDropManager_dragSource, oEventDragEnd);

		var bDefaultPrevented	= oEvent.defaultPrevented || oEvent.button || bDropPrevented || oEventDragEnd.defaultPrevented,
			bPlay	= oDOMConfiguration_values["ample-enable-transitions"] &&(bDefaultPrevented || oDragAndDropManager_dataTransfer.dropEffect == "move" || oDragAndDropManager_dataTransfer.dropEffect == "copy");
		if (bPlay) {
			var oRect	= fElement_getBoundingClientRect(oDragAndDropManager_dragSource),
				nLeft	=(oRect0.left - oRect.left + fParseInt(oElementDOM.style.left)),
				nTop	=(oRect0.top - oRect.top + fParseInt(oElementDOM.style.top));
			// Commit
			oElementDOM.style.left	= sDragAndDropManager_originalLeft;
			oElementDOM.style.top	= sDragAndDropManager_originalTop;
			var oRect1	= fElement_getBoundingClientRect(oDragAndDropManager_dragSource);
			// Rollback
			oElementDOM.style.left	= nLeft + 'px';
			oElementDOM.style.top	= nTop + 'px';
		}

		// Execute default action
		if (!bDefaultPrevented && oDragAndDropManager_dropTarget && oDragAndDropManager_dropTarget != oDragAndDropManager_dragSource.parentNode) {
			if (oDragAndDropManager_dataTransfer.dropEffect == "copy")
				fElement_appendChild(oDragAndDropManager_dropTarget, fNode_cloneNode(oDragAndDropManager_dragSource, true));	// TODO: remove @id attribute values
			else
			if (oDragAndDropManager_dataTransfer.dropEffect == "move")
				fElement_appendChild(oDragAndDropManager_dropTarget, oDragAndDropManager_dragSource);
		}

		if (bDefaultPrevented || oDragAndDropManager_dataTransfer.dropEffect == "move" || oDragAndDropManager_dataTransfer.dropEffect == "copy") {
			var oStyle		= oElementDOM.style,
				fRestore	= function() {
					oStyle.left		= sDragAndDropManager_originalLeft;
					oStyle.top		= sDragAndDropManager_originalTop;
				};

			// Restore element position
			if (bPlay) {
				// Commit
				oStyle.left	= sDragAndDropManager_originalLeft;
				oStyle.top	= sDragAndDropManager_originalTop;
				var oRect2	= fElement_getBoundingClientRect(oDragAndDropManager_dragSource);
				// Rollback
				oStyle.left	=(nLeft + oRect1.left - oRect2.left)+ 'px';
				oStyle.top	=(nTop + oRect1.top - oRect2.top)+ 'px';
				//
				var oProperties	= {};
				oProperties["left"]		= sDragAndDropManager_originalLeft || "auto";
				oProperties["top"]		= sDragAndDropManager_originalTop || "auto";

				fNodeAnimation_play(oDragAndDropManager_dragSource, oProperties, "normal", "ease", fRestore);
			}
			else
				fRestore();
		}

		// End session
		fBrowser_toggleSelect(true);
		if (bTrident)
			oElementDOM.releaseCapture();

		//
		fCaptureManager_releaseCapture(oDragAndDropManager_dragSource);

		// Hide drag image
		oDragAndDropManager_image.innerHTML	= '';
		oDragAndDropManager_image.style.display	= "none";
	}

	oDragAndDropManager_dragSource	= null;
	nDragAndDropManager_dragState	= nDragAndDropManager_STATE_RELEASED;
	oDragAndDropManager_dropTarget	= null;
};

function fDragAndDropManager_onMouseMove(oEvent) {
	if (nDragAndDropManager_dragState == nDragAndDropManager_STATE_RELEASED)
		return;

	// Clear timeout
	if (nDragAndDropManager_timeout)
		nDragAndDropManager_timeout	= fClearTimeout(nDragAndDropManager_timeout);

		// Stop event propagation
		oEvent.stopPropagation();

	var oElementDOM	= oDragAndDropManager_dragSource.$getContainer(),
		oRect	= fElement_getBoundingClientRect(oDragAndDropManager_dragSource),
		oStyle	= oElementDOM.style;

	// Turn mode to interactive
	if (nDragAndDropManager_dragState == nDragAndDropManager_STATE_CAPTURED) {
		// Initialize DataTransfer object
		oDragAndDropManager_dataTransfer	= new cDataTransfer;

		// Initialize drag image container
		if (!oDragAndDropManager_image) {
			oDragAndDropManager_image	= oBrowser_body.appendChild(oUADocument.createElement("div"));
			oDragAndDropManager_image.style.cssText	= 'z-index:1000;position:absolute;display:none';
		}

		// fire ondragstart event
		var oEventDragStart	= new cDragEvent;
		oEventDragStart.initDragEvent("dragstart", true, true, window, null, oDragAndDropManager_dataTransfer);
		oEventDragStart.$pseudoTarget	= oEvent.$pseudoTarget;
		fEventTarget_dispatchEvent(oDragAndDropManager_dragSource, oEventDragStart);

		if (oEventDragStart.defaultPrevented) {
			// end operation and return
			nDragAndDropManager_dragState	= nDragAndDropManager_STATE_RELEASED;
			return;
		}

		// Save current position
		sDragAndDropManager_originalLeft	= oStyle.left;
		sDragAndDropManager_originalTop		= oStyle.top;

		// Add :drag pseudo-class
		fElement_setPseudoClass(oDragAndDropManager_dragSource, "drag", true);

		// set capture and prevent selection
		fBrowser_toggleSelect(false);
		if (bTrident)
			oElementDOM.setCapture();
		fCaptureManager_setCapture(oDragAndDropManager_dragSource, true);

		// Show drag image
		oDragAndDropManager_image.style.display	= '';

		// fill in array with drag targets
		var aElements	= fElement_getElementsByTagName(oBrowser_modalNode || this.documentElement, '*');
		for (var nIndex = 0, nLength = aElements.length; nIndex < nLength; nIndex++)
			if (aElements[nIndex].$droppable)
				aDragAndDropManager_dropTargets.push(aElements[nIndex]);

		//
		nDragAndDropManager_dragState	= nDragAndDropManager_STATE_DRAGGED;

		// Init session
		nDragAndDropManager_mouseX	= oEvent.clientX;
		nDragAndDropManager_mouseY	= oEvent.clientY;

		// move drag source position to (0, 0)
		oStyle.left	= 0;
		oStyle.top	= 0;

		// get drag source position at (0, 0)
		var oRect0	= fElement_getBoundingClientRect(oDragAndDropManager_dragSource);

		// restore drag source position
		oStyle.left	= sDragAndDropManager_originalLeft;
		oStyle.top	= sDragAndDropManager_originalTop;

		// save offset position
		nDragAndDropManager_offsetLeft	= oRect.left - oRect0.left;
		nDragAndDropManager_offsetTop	= oRect.top - oRect0.top;

		// save initial scroll positions
		var oScroll	= fDragAndDropManager_getScroll(oElementDOM);
		nDragAndDropManager_scrollLeft	= oScroll.left;
		nDragAndDropManager_scrollTop	= oScroll.top;
	}

	var oDropTarget	= null,
		oRect2,
		nAreaSource	=(oRect.right - oRect.left) * (oRect.bottom - oRect.top),
		nAreaTarget,
		nAreaTargetMin	= nInfinity,
		nIntersection,
		nPartialMax	= 0;

	for (var nIndex = 0, nLength = aDragAndDropManager_dropTargets.length; nIndex < nLength; nIndex++) {
		// if source is the target, continue
		if (aDragAndDropManager_dropTargets[nIndex] == oDragAndDropManager_dragSource)
			continue;

		// if target contains source, continue
		if (fNode_compareDocumentPosition(aDragAndDropManager_dropTargets[nIndex], oDragAndDropManager_dragSource) & 8 /* cNode.DOCUMENT_POSITION_CONTAINS */)
			continue;

		oRect2	= fElement_getBoundingClientRect(aDragAndDropManager_dropTargets[nIndex]);
		nAreaTarget	=(oRect2.right - oRect2.left) * (oRect2.bottom - oRect2.top);
		nIntersection	= fDragAndDropManager_intersectRectangle(oRect, oRect2);
		if (nIntersection < nAreaSource) {
			// partial intersection
			if (nIntersection > nPartialMax) {
				nPartialMax	= nIntersection;
				oDropTarget	= aDragAndDropManager_dropTargets[nIndex];
			}
		}
		else {
			// complete intersection
			if (nAreaTarget < nAreaTargetMin) {
				nAreaTargetMin	= nAreaTarget;
				oDropTarget	= aDragAndDropManager_dropTargets[nIndex];
			}
		}
	}

	// if there was a drop target and it is different from a new one
	if (oDragAndDropManager_dropTarget) {
		if (oDragAndDropManager_dropTarget != oDropTarget) {
			// Remove :drop pseudo-class
			fElement_setPseudoClass(oDragAndDropManager_dropTarget, "drop", false);
			// fire ondragleave event
			var oEventDragLeave	= new cDragEvent;
			oEventDragLeave.initDragEvent("dragleave", true, true, window, null, oDragAndDropManager_dataTransfer);
			oEventDragLeave.relatedTarget	= oDragAndDropManager_dragSource;
			oEventDragLeave.$pseudoTarget	= oEvent.$pseudoTarget;
			fEventTarget_dispatchEvent(oDragAndDropManager_dropTarget, oEventDragLeave);
		}
	}

	// fire ondrag event
	var oEventDrag	= new cDragEvent;
	oEventDrag.initDragEvent("drag", true, true, window, null, oDragAndDropManager_dataTransfer);
	oEventDrag.$pseudoTarget	= oEvent.$pseudoTarget;
	oEventDrag.relatedTarget	= oDropTarget;
	fEventTarget_dispatchEvent(oDragAndDropManager_dragSource, oEventDrag);

	//
	if (oDropTarget) {
		if (oDropTarget != oDragAndDropManager_dropTarget) {
			// fire ondragenter event
			var oEventDragEnter	= new cDragEvent;
			oEventDragEnter.initDragEvent("dragenter", true, true, window, null, oDragAndDropManager_dataTransfer);
			oEventDragEnter.$pseudoTarget	= oEvent.$pseudoTarget;
			oEventDragEnter.relatedTarget	= oDragAndDropManager_dragSource;
			fEventTarget_dispatchEvent(oDropTarget, oEventDragEnter);
			if (oEventDragEnter.defaultPrevented)
				oDropTarget	= null;
			else	// Add :drop pseudo-class
				fElement_setPseudoClass(oDropTarget, "drop", true);
		}

		// If dragenter was not canceled, fire dragover
		if (oDropTarget) {
			// fire ondragover event
			var oEventDragOver	= new cDragEvent;
			oEventDragOver.initDragEvent("dragover", true, true, window, null, oDragAndDropManager_dataTransfer);
			oEventDragOver.$pseudoTarget	= oEvent.$pseudoTarget;
			oEventDragOver.relatedTarget	= oDragAndDropManager_dragSource;
			fEventTarget_dispatchEvent(oDropTarget, oEventDragOver);
		}
	}

	oDragAndDropManager_dropTarget	= oDropTarget;

	var oScroll	= fDragAndDropManager_getScroll(oElementDOM);
	if (!oEventDrag.defaultPrevented) {
		// Move dragged element
		oStyle.left	=(oScroll.left - nDragAndDropManager_scrollLeft) + nDragAndDropManager_offsetLeft + (oEvent.clientX - nDragAndDropManager_mouseX) + 'px';
		oStyle.top	=(oScroll.top - nDragAndDropManager_scrollTop) + nDragAndDropManager_offsetTop + (oEvent.clientY - nDragAndDropManager_mouseY) + 'px';
	}

	if (oDragAndDropManager_image) {
		oDragAndDropManager_image.style.left	= oEvent.clientX + 'px';
		oDragAndDropManager_image.style.top		= oEvent.clientY + 'px';
	}

	// Opera doesn't support userSelect, so manual clearing of ranges is used
	if (!bTrident)
		window.getSelection().removeAllRanges();
};

function fDragAndDropManager_onKeyDown(oEvent) {
	if (oEvent.keyIdentifier == "U+001B") {	// Esc
		oEvent.preventDefault();
		fDragAndDropManager_onMouseUp(oEvent);	// TODO: object with Keyboard interface passing to a function expecting MouseEvent interface
	}
};

function fDragAndDropManager_getScroll(oElementDOM) {
	var oScroll	= {};
	oScroll.left	= 0;
	oScroll.top		= 0;
	for (; oElementDOM && oElementDOM.nodeType == 1; oElementDOM = oElementDOM.parentNode) {
		oScroll.left	+= oElementDOM.scrollLeft;
		oScroll.top		+= oElementDOM.scrollTop;
	}
	return oScroll;
};

function fDragAndDropManager_intersectRectangle(oRect1, oRect2) {
	return fDragAndDropManager_intersectSegment(oRect1.left, oRect1.right - oRect1.left, oRect2.left, oRect2.right - oRect2.left) * fDragAndDropManager_intersectSegment(oRect1.top, oRect1.bottom - oRect1.top, oRect2.top, oRect2.bottom - oRect2.top);
};

function fDragAndDropManager_intersectSegment(x, y, a, b) {
	return a > x ? (a <= x + y ? a + b < x + y ? b : x + y - a : 0) : (a >= x - b ? a + b < x + y ? a + b - x : y : 0);
};

// Attaching to implementation
cElement.prototype.$draggable	= false;
cElement.prototype.$droppable	= false;

// Registering Event Handlers
fEventTarget_addEventListener(oAmple_document, "mousedown",	fDragAndDropManager_onMouseDown,	false);
fEventTarget_addEventListener(oAmple_document, "mousemove",	fDragAndDropManager_onMouseMove,	false);
fEventTarget_addEventListener(oAmple_document, "mouseup",	fDragAndDropManager_onMouseUp,		false);
fEventTarget_addEventListener(oAmple_document, "keydown",	fDragAndDropManager_onKeyDown,		false);
