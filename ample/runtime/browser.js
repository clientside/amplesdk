/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Private Variables
var oBrowser_factory	= oUADocument.createElement("span"),
	oBrowser_keyIdentifiers	= fUtilities_stringToHash('8:Backspace;9:Tab;13:Enter;16:Shift;17:Control;18:Alt;20:CapsLock;27:Esc;33:PageUp;34:PageDown;35:End;36:Home;37:Left;38:Up;39:Right;40:Down;45:Insert;46:Backspace;91:Win;112:F1;113:F2;114:F3;115:F4;116:F5;117:F6;118:F7;119:F8;120:F9;121:F10;122:F11;123:F12;127:Del'),
	aBrowser_mouseNodes	= new cAMLNodeList,
	oBrowser_mouseNode	= null,
	oBrowser_captureNode= null,		// Set in Capture manager
	oBrowser_modalNode	= null,		// Set in Capture manager
	bBrowser_keyDown	= false,	// Holds keydown state
	bBrowser_userSelect	= true;

// Events handling
function fBrowser_attachEvent(oNode, sEvent, fHandler) {
	if (bTrident)
		oNode.attachEvent('on' + sEvent, fHandler);
	else
		oNode.addEventListener(sEvent, fHandler, false);
};

function fBrowser_detachEvent(oNode, sEvent, fHandler) {
	if (bTrident)
		oNode.detachEvent('on' + sEvent, fHandler);
	else
		oNode.removeEventListener(sEvent, fHandler, false);
};

// Finds AMLElement by event target
function fBrowser_getEventTarget(oEvent) {
    return oAmple.$instance(oEvent.srcElement || oEvent.target) || oAmple_document.documentElement;
};

function fBrowser_getUIEventPseudo(oEvent) {
    for (var oNode = oEvent.srcElement || oEvent.target, sId, sClass; oNode; oNode = oNode.parentNode) {
        if ((sId = oNode.id) && oAMLDocument_ids[sId])
            return oNode;
		else
		if ((sClass = oNode.className) && cString(sClass || sClass.baseVal).match(/--[\w-]+/))
			return oNode;
    }
    return null;
};

function fBrowser_isDescendant(oNode, oParent) {
	for (; oNode; oNode = oNode.parentNode)
		if (oNode == oParent)
			return true;
	return false;
};

function fBrowser_getUIEventButton(oEvent) {
	var nButton	= oEvent.button;
	if (!bTrident)
		return nButton;
	if (nButton == 4)
		return 1;
	if (nButton == 2)
		return 2;
	return 0;
};

function fBrowser_render(oNode) {
	if (oNode.nodeType == cAMLNode.TEXT_NODE)
		return oUADocument.createTextNode(oNode.nodeValue);
	else
	if (oNode.nodeType == cAMLNode.ELEMENT_NODE) {
		var sHtml	= oNode.$getTag();
		if (sHtml) {
			if (bTrident) {
				if (sHtml.match(/^<(\w*:)?(\w+)/)) {
					var sTagName	= cRegExp.$2;
					switch (sTagName) {
						case "td":
						case "th":
							sHtml	= '<' + "tr" + '>' + sHtml + '</' + "tr" + '>';
							// no break is left intentionally
						case "tr":
							sHtml	= '<' + "tbody" + '>' + sHtml + '</' + "tbody" + '>';
							// no break is left intentionally
						case "thead":
						case "tbody":
						case "tfoot":
							sHtml	= '<' + "table" + '>' + sHtml + '</' + "table" + '>';
						    break;
						case "option":
							sHtml	= '<' + "select" + '>' + sHtml + '</' + "select" + '>';
							break;
					}
					// Render HTML
					oBrowser_factory.innerHTML	= sHtml;
					// Return Node
				    return oBrowser_factory.getElementsByTagName(sTagName)[0] || null;
				}
			}
			else {
				// Add namespace declarations to the shadow content
				if (!("xmlns" + (oNode.prefix ? ':' + oNode.prefix : '') in oNode.attributes) || (oNode.namespaceURI != "http://www.w3.org/2000/svg" && oNode.namespaceURI != "http://www.w3.org/1999/xhtml"))
					sHtml	= sHtml.replace(/^(<(?:(\w+)(:))?(\w+))/, '$1 ' + "xmlns" + '$3$2="' + (oNode.namespaceURI == "http://www.w3.org/2000/svg" ? "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml") + '"');
				return oUADocument.importNode(new cDOMParser().parseFromString('<!' + "DOCTYPE" + ' ' + "div" + '[' + aUtilities_entities + ']>' + sHtml, "text/xml").documentElement, true);
			}
		}
	}
	return null;
};

// User selection
function fBrowser_getKeyboardEventIdentifier(oEvent) {
	return oBrowser_keyIdentifiers[oEvent.keyCode] || ('U+' + fUtilities_numberToHex(oEvent.keyCode, 4).toUpperCase());
};

function fBrowser_getKeyboardEventModifiersList(oEvent) {
	var aModifiersList = [];
	if (oEvent.altKey)
		aModifiersList[aModifiersList.length] = "Alt";
	if (oEvent.ctrlKey)
		aModifiersList[aModifiersList.length] = "Control";
	if (oEvent.metaKey)
		aModifiersList[aModifiersList.length] = "Meta";
	if (oEvent.shiftKey)
		aModifiersList[aModifiersList.length] = "Shift";
	return aModifiersList.join(' ');
};

function fBrowser_eventPreventDefault(oEvent) {
    for (var nIndex = 1, nLength = arguments.length; nIndex < nLength; nIndex++)
	    if (arguments[nIndex].defaultPrevented) {
	    	if (oEvent.preventDefault)
		    	oEvent.preventDefault();
	    	return false;
	    }
    return true;
};

function fBrowser_onMouseWheel(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		bPrevent	= false,
		nWheelDelta	= bGecko ? oEvent.detail : -1 * oEvent.wheelDelta / 40,
		oEventMouseWheel	= new cAMLMouseWheelEvent;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
		bPrevent	= true;
	}

	// Init MouseWheel event
	oEventMouseWheel.initMouseWheelEvent("mousewheel", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, fBrowser_getUIEventButton(oEvent), null, fBrowser_getKeyboardEventModifiersList(oEvent), nWheelDelta);
	oEventMouseWheel.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode))
    	fAMLNode_dispatchEvent(oTarget, oEventMouseWheel);
    else
    	bPrevent	= true;

    if (bPrevent)
    	oEventMouseWheel.preventDefault();

	//
	return fBrowser_eventPreventDefault(oEvent, oEventMouseWheel);
};

// Key Events
function fBrowser_onKeyDown(oEvent) {
	var oTarget		= oAmple_document.activeElement || oAmple_document.documentElement,	// FF bugfix
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		oEventKeyDown	= new cAMLKeyboardEvent;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
	}

    // Init KeyDown event
    oEventKeyDown.initKeyboardEvent("keydown", true, true, window, fBrowser_getKeyboardEventIdentifier(oEvent), null, fBrowser_getKeyboardEventModifiersList(oEvent));
    oEventKeyDown.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode))
    	fAMLNode_dispatchEvent(oTarget, oEventKeyDown);

	//
	return fBrowser_eventPreventDefault(oEvent, oEventKeyDown);
};

function fBrowser_onKeyPress(oEvent)
{
	// Opera doesn't repeat keydown, but does repeat keypress
	if (bPresto && bBrowser_keyDown)
		fBrowser_onKeyDown(oEvent);

    // Fix for repeated keydown in presto
    bBrowser_keyDown	= true;

	// Filter out non-alphanumerical keypress events
	if (oEvent.ctrlKey || oEvent.altKey || oEvent.keyCode in oBrowser_keyIdentifiers)
		return;

	var oTarget		= oAmple_document.activeElement || oAmple_document.documentElement,	// FF bugfix
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		oEventKeyPress	= new cAMLKeyboardEvent,
		oEventTextInput	= new cAMLTextEvent;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
	}

    // Init KeyPress event
    oEventKeyPress.initKeyboardEvent("keypress", true, true, window, fBrowser_getKeyboardEventIdentifier(oEvent), null, fBrowser_getKeyboardEventModifiersList(oEvent));
	oEventKeyPress.$pseudoTarget	= oPseudo;

	// Init TextInput event
	oEventTextInput.initTextEvent("textInput", true, true, null, cString.fromCharCode(oEvent.charCode || oEvent.keyCode));
    oEventTextInput.$pseudoTarget	= oPseudo;

    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode)) {
    	//
    	fAMLNode_dispatchEvent(oTarget, oEventKeyPress);
		//
    	fAMLNode_dispatchEvent(oTarget, oEventTextInput);
    }

	//
	return fBrowser_eventPreventDefault(oEvent, oEventKeyPress, oEventTextInput);
};

function fBrowser_onKeyUp(oEvent) {
	var oTarget		= oAmple_document.activeElement || oAmple_document.documentElement,
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		oEventKeyUp	= new cAMLKeyboardEvent;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
	}

    // Init KeyUp event
	oEventKeyUp.initKeyboardEvent("keyup", true, true, window, fBrowser_getKeyboardEventIdentifier(oEvent), null, fBrowser_getKeyboardEventModifiersList(oEvent));
	oEventKeyUp.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode))
    	fAMLNode_dispatchEvent(oTarget, oEventKeyUp);

    bBrowser_keyDown	= false;

	//
	return fBrowser_eventPreventDefault(oEvent, oEventKeyUp);
};

function fBrowser_onMouseOver(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		nButton 	= fBrowser_getUIEventButton(oEvent),
		oEventMouseOver,
		oEventMouseOut;

	if (oTarget == oBrowser_mouseNode)
		return;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
	}

	// TODO: Remove this dependency from here
	if (!(nAMLDragAndDrop_dragState || nAMLResize_resizeState)) {
		// do not dispatch event if outside modal
	    if (!oBrowser_modalNode || fBrowser_isDescendant(oBrowser_mouseNode, oBrowser_modalNode)) {
			if (oBrowser_mouseNode && oAMLDocument_all[oBrowser_mouseNode.uniqueID]) {
			    // Create an Event
			    oEventMouseOut = new cAMLMouseEvent;
			    oEventMouseOut.initMouseEvent("mouseout", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, oTarget);
				oEventMouseOut.$pseudoTarget	= oPseudo;
				fAMLNode_dispatchEvent(oBrowser_mouseNode, oEventMouseOut);
			}
	    }

		// do not dispatch event if outside modal
	    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode)) {
		    // Create an Event
		    oEventMouseOver = new cAMLMouseEvent;
		    oEventMouseOver.initMouseEvent("mouseover", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, oBrowser_mouseNode);
		    oEventMouseOver.$pseudoTarget	= oPseudo;
		    fAMLNode_dispatchEvent(oTarget, oEventMouseOver);
	    }
	}

	//
	oBrowser_mouseNode	= oTarget;
};

// Touches
function fBrowser_getTouches(oUATouches) {
	var nIndex	= 0,
		nLength	= oUATouches.length,
		oTouches	= new cAMLTouchList,
		oTouch,
		oUATouch;
	while (nIndex < nLength) {
		oUATouch	= oUATouches.item(nIndex++);
		oTouch		= new cAMLTouch;
		oTouch.clientX	= oUATouch.clientX;
		oTouch.clientY	= oUATouch.clientY;
		oTouch.identifier	= oUATouch.identifier;
		oTouch.pageX	= oUATouch.pageX;
		oTouch.pageY	= oUATouch.pageY;
		oTouch.screenX	= oUATouch.screenX;
		oTouch.screenY	= oUATouch.screenY;
		oTouches[oTouches.length++]	= oTouch;
	}
	return oTouches;
};

function fBrowser_onTouch(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		oEventTouch	= new cAMLTouchEvent;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
	}

    // Init Touch event
	oEventTouch.initTouchEvent(oEvent.type, oEvent.bubbles, oEvent.cancelable, oEvent.view, oEvent.detail, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, fBrowser_getTouches(oEvent.touches), fBrowser_getTouches(oEvent.targetTouches), fBrowser_getTouches(oEvent.changedTouches), oEvent.scale, oEvent.rotation);
	oEventTouch.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode))
    	fAMLNode_dispatchEvent(oTarget, oEventTouch);

	//
	return fBrowser_eventPreventDefault(oEvent, oEventTouch);
};

function fBrowser_onGesture(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		oEventGesture	= new cAMLGestureEvent;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
	}

    // Init Touch event
	oEventGesture.initGestureEvent(oEvent.type, oEvent.bubbles, oEvent.cancelable, oEvent.view, oEvent.detail, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, oEvent.target, oEvent.scale, oEvent.rotation);
	oEventGesture.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode))
    	fAMLNode_dispatchEvent(oTarget, oEventGesture);

	//
	return fBrowser_eventPreventDefault(oEvent, oEventGesture);
};

/*
oUADocument.attachEvent('on' + "mouseover", function(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent);
    // Create an Event
    var oEventMouseOver = new cAMLMouseEvent;
    oEventMouseOver.initMouseEvent("mouseover", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, oEvent.button, null);
    oEventMouseOver.$pseudoTarget	= oPseudo;
	fAMLNode_dispatchEvent(oTarget, oEventMouseOver);
});

oUADocument.attachEvent('on' + "mouseout", function(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent);
    // Create an Event
    var oEventMouseOut = new cAMLMouseEvent;
    oEventMouseOut.initMouseEvent("mouseout", true, false, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, oEvent.button, null);
    oEventMouseOut.$pseudoTarget	= oPseudo;
	fAMLNode_dispatchEvent(oTarget, oEventMouseOut);
});
*/

function fBrowser_onMouseMove(oEvent) {
    var oTarget		= fBrowser_getEventTarget(oEvent),
    	oPseudo		= fBrowser_getUIEventPseudo(oEvent),
    	nButton 	= fBrowser_getUIEventButton(oEvent),
    	nIndexCommon=-1,
    	aElements	= new cAMLNodeList,
    	oEventMouseMove = new cAMLMouseEvent,
    	oEventMouseLeave,
		oEventMouseEnter;

	//
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
	}

	// TODO: Remove this dependency from here
	if (!(nAMLDragAndDrop_dragState || nAMLResize_resizeState)) {
		if (aBrowser_mouseNodes[0] != oTarget) {
			// find common relative
			for (var oElement = oTarget; oElement.nodeType != cAMLNode.DOCUMENT_NODE; oElement = oElement.parentNode) {
				aElements.$add(oElement);
				if (nIndexCommon ==-1)
					nIndexCommon = aBrowser_mouseNodes.$indexOf(oElement);
			}

			// TODO: Come up with a better implementation that doesn't check for modality on every iteration in loops

			// propagate mouseleave branch
			for (var nIndex = 0; nIndex < nIndexCommon; nIndex++) {
				// do not dispatch event if outside modal
				if (!oBrowser_modalNode || fBrowser_isDescendant(aBrowser_mouseNodes[nIndex], oBrowser_modalNode)) {
					oEventMouseLeave = new cAMLMouseEvent;
				    oEventMouseLeave.initMouseEvent("mouseleave", false, false, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, aBrowser_mouseNodes[nIndex + 1] || null);
				    oEventMouseLeave.$pseudoTarget	= oPseudo;
				    fAMLNode_dispatchEvent(aBrowser_mouseNodes[nIndex], oEventMouseLeave);
				}
			}

			// propagate mouseenter branch
			for (var nIndex	= nIndexCommon + aElements.length - aBrowser_mouseNodes.length; nIndex > 0; nIndex--) {
				// do not dispatch event if outside modal
				if (!oBrowser_modalNode || fBrowser_isDescendant(aElements[nIndex - 1], oBrowser_modalNode)) {
				    oEventMouseEnter = new cAMLMouseEvent;
				    oEventMouseEnter.initMouseEvent("mouseenter", false, false, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, aElements[nIndex] || null);
				    oEventMouseEnter.$pseudoTarget	= oPseudo;
				    fAMLNode_dispatchEvent(aElements[nIndex - 1], oEventMouseEnter);
				}
		    }

			// save current path stack
			aBrowser_mouseNodes	= aElements;
		}
	}

	// scope to modal
    if (oBrowser_modalNode && fBrowser_isDescendant(oTarget, oBrowser_modalNode))
    	oTarget	= oBrowser_modalNode;

    // Init MouseMove event
    oEventMouseMove.initMouseEvent("mousemove", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, null);
    oEventMouseMove.$pseudoTarget	= oPseudo;
    fAMLNode_dispatchEvent(oTarget, oEventMouseMove);

	//
	return fBrowser_eventPreventDefault(oEvent, oEventMouseMove);
};

function fBrowser_onContextMenu(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		nButton 	= fBrowser_getUIEventButton(oEvent),
		bPrevent	= false,
		oEventClick	= new cAMLMouseEvent,
		oEventContextMenu	= new cAMLMouseEvent;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
		bPrevent	= true;
	}

	// Init Click event
	oEventClick.initMouseEvent("click", true, true, window, oEvent.detail || 1, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, null, 2, null);
	oEventClick.$pseudoTarget	= oPseudo;

    // Init ContextMenu event
    oEventContextMenu.initMouseEvent("contextmenu", true, true, window, oEvent.detail || 1, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, 2, null);
    oEventContextMenu.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode)) {
    	// Simulate missing 'click' event in IE and WebKit
		if (bTrident || bWebKit)
			fAMLNode_dispatchEvent(oTarget, oEventClick);

		fAMLNode_dispatchEvent(oTarget, oEventContextMenu);
    }
    else
    	bPrevent	= true;

	if (bPrevent)
		oEventContextMenu.preventDefault();

	//
	return fBrowser_eventPreventDefault(oEvent, oEventContextMenu, oEventClick);
};

function fBrowser_onClick(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		nButton		= fBrowser_getUIEventButton(oEvent),
		bPrevent	= false,
		oEventClick	= new cAMLMouseEvent;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
		bPrevent	= true;
	}
	// Init Click event
    oEventClick.initMouseEvent("click", true, true, window, oEvent.detail || 1, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, null);
    oEventClick.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode))
    	fAMLNode_dispatchEvent(oTarget, oEventClick);
    else
    	bPrevent	= true;

	if (bPrevent)
		oEventClick.preventDefault();

	//
	return fBrowser_eventPreventDefault(oEvent, oEventClick);
};

function fBrowser_onDblClick(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		nButton		= fBrowser_getUIEventButton(oEvent),
		oEventDblClick = new cAMLMouseEvent,
		oEventClick,
		oEventMouseDown,
		oEventMouseUp;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
	}

	// Init DblClick event
    oEventDblClick.initMouseEvent("dblclick", true, true, window, oEvent.detail || 2, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, null);
    oEventDblClick.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode)) {
		if (bTrident) {
	 		// Simulate missing 'mousedown' event in IE
	    	oEventMouseDown = new cAMLMouseEvent;
	    	oEventMouseDown.initMouseEvent("mousedown", true, true, window, 2, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, null, nButton, null);
	    	oEventMouseDown.$pseudoTarget	= oPseudo;
	    	fAMLNode_dispatchEvent(oTarget, oEventMouseDown);

	 		// Simulate missing 'click' event in IE
	    	oEventClick = new cAMLMouseEvent;
	    	oEventClick.initMouseEvent("click", true, true, window, 2, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, null, nButton, null);
	    	oEventClick.$pseudoTarget	= oPseudo;
	    	fAMLNode_dispatchEvent(oTarget, oEventClick);
		}

		fAMLNode_dispatchEvent(oTarget, oEventDblClick);

		// Simulate missing 'mouseup' event in IE
		if (bTrident) {
	    	oEventMouseUp = new cAMLMouseEvent;
	    	oEventMouseUp.initMouseEvent("mouseup", true, true, window, 2, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, null, nButton, null);
	    	oEventMouseUp.$pseudoTarget	= oPseudo;
	    	fAMLNode_dispatchEvent(oTarget, oEventMouseUp);
		}
    }
};

function fBrowser_onMouseDown(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		nButton		= fBrowser_getUIEventButton(oEvent),
		bCapture	= false,
		bModal		= false,
		oEventMouseDown = new cAMLMouseEvent;

	// change target if some element is set to receive capture
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
		bCapture	= true;
	}

	// Init MouseDown event
    oEventMouseDown.initMouseEvent("mousedown", true, true, window, oEvent.detail || 1, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, null);
    oEventMouseDown.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
	if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode)) {
		// Moved here from #mouseup handler. Not sure yet if it is right though
		oAmple_document.activeElement	= oTarget;
		//
		fAMLNode_dispatchEvent(oTarget, oEventMouseDown);
	}
	else {
		bModal	= true;
	}

	if (bCapture || bModal) {
		// Notify element on capture
		var oCaptureEvent	= new cAMLUIEvent;
		oCaptureEvent.initUIEvent("capture", true, false, window, null);
		oCaptureEvent.$pseudoTarget	= oPseudo;
		fAMLNode_dispatchEvent(bModal ? oBrowser_modalNode : oTarget, oCaptureEvent);
		//
		oEventMouseDown.preventDefault();
	}

	// toggle user-selection (IE only)
	if (oEventMouseDown.defaultPrevented)
		bBrowser_userSelect	= false;

	//
	return fBrowser_eventPreventDefault(oEvent, oEventMouseDown);
};

function fBrowser_onMouseUp(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		nButton		= fBrowser_getUIEventButton(oEvent),
		oEventMouseUp	= new cAMLMouseEvent;

	// change target if some element is set to receive capture
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
	}

	// Init MouseUp event
    oEventMouseUp.initMouseEvent("mouseup", true, true, window, oEvent.detail || 1, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, null);
    oEventMouseUp.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
	if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode))
		fAMLNode_dispatchEvent(oTarget, oEventMouseUp);

	//
	return fBrowser_eventPreventDefault(oEvent, oEventMouseUp);
};

function fBrowser_onResize(oEvent) {
    // Create an Event
    var oEventResize = new cAMLUIEvent;
    oEventResize.initUIEvent("resize", true, false, window, null);
    fAMLNode_dispatchEvent(oAmple_document, oEventResize);
};

function fBrowser_onScroll(oEvent) {
    // Create an Event
    var oEventScroll = new cAMLUIEvent;
    oEventScroll.initUIEvent("scroll", true, false, window, null);
    fAMLNode_dispatchEvent(oAmple_document, oEventScroll);
};

function fBrowser_onSelectStart() {
	var bUserSelect	= bBrowser_userSelect;
	bBrowser_userSelect	= true;
	return bUserSelect;
};

function fBrowser_toggleSelect(bAllow) {
	if (bTrident)
		bBrowser_userSelect	= bAllow;
	else {
		var oStyle	= oUADocument.documentElement.style;
		oStyle.WebkitUserSelect	=
		oStyle.MozUserSelect	=
		oStyle.OperaUserSelect	=
		oStyle.KhtmlUserSelect 	=
		oStyle.userSelect		= bAllow ? '' : "none";
	}
};

// Utilities
function fBrowser_replaceNode(oOld, oNew) {
	oOld.parentNode.insertBefore(oNew, oOld);
	oOld.parentNode.removeChild(oOld);
};

function fBrowser_getResponseDocument(oRequest) {
	var oDocument	= oRequest.responseXML,
		sText		= oRequest.responseText;
	// Try parsing responseText
	if (bTrident && sText && oDocument && !oDocument.documentElement && oRequest.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/))
		oDocument	= new cDOMParser().parseFromString(sText, "text/xml");
	// Check if there is no error in document
	if (oDocument)
		if ((bTrident && oDocument.parseError != 0) || !oDocument.documentElement || (oDocument.documentElement && oDocument.documentElement.tagName == "parsererror"))
			return null;
	return oDocument;
};

function fBrowser_createStyleSheet(sCSS, sUri, sMedia) {
	// Process Stylesheet
	oBrowser_factory.innerHTML	= "#text" + '<' + "style" + ' ' + "type" + '="' + "text/css" + '"' + (sMedia ? ' ' + "media" + '="' + sMedia + '"' : '') + '>' + fAML_parseStyleSheet(sCSS, sUri) + '</' + "style" + '>';
	return oBrowser_factory.childNodes[1];
};

function fBrowser_loadStyleSheet(sUri) {
	var oRequest	= new cXMLHttpRequest;
	oRequest.open("GET", sUri, false);
	oRequest.setRequestHeader("Accept", "text/css" + ',*' + '/' + '*;q=0.1');
	oRequest.send(null);

	return oRequest.responseText;
};

function fBrowser_getComputedStyle(oElementDOM) {
	return oElementDOM.currentStyle || window.getComputedStyle(oElementDOM, null);
};

function fBrowser_getStyle(oElementDOM, sName) {
	var oStyle	= fBrowser_getComputedStyle(oElementDOM);
	if (bTrident && nVersion < 9) {
		if (sName == "opacity")
			return cString(cString(oStyle.filter).match(/opacity=([\.0-9]+)/i) ? oElementDOM.filters.item("DXImageTransform.Microsoft.Alpha").opacity / 100 : 1);
		else
		if (sName == "backgroundPosition")
			return oStyle[sName + 'X'] + ' ' + oStyle[sName + 'Y'];
	}
	//
	return oStyle[sName == "borderColor" ? "borderBottomColor" : sName];
};

function fBrowser_setStyle(oElementDOM, sName, sValue) {
	var oStyle	= oElementDOM.style;
	if (bTrident && nVersion < 9) {
		if (sName == "opacity") {
			var sFilter	= cString(oElementDOM.currentStyle.filter),
				bFilter	= sFilter.match(/opacity=([\.0-9]+)/i);
			if (sValue < 1) {
				if (!bFilter) {
					oStyle.filter	= sFilter + ' ' + "progid" + ':' + "DXImageTransform.Microsoft.Alpha" + '(' + "opacity" + '=100)';
					if (!oElementDOM.currentStyle.hasLayout)
						oElementDOM.style.zoom	= '1';
				}
				oElementDOM.filters.item("DXImageTransform.Microsoft.Alpha").opacity	= cMath.round(sValue * 100);
			}
			else
			if (oElementDOM.filters.length == 1 && bFilter)	// Single opacity filter applied
				oStyle.removeAttribute("filter");
			return;
		}
		else
		if (sName == "backgroundPosition") {
			var aValue	=(sValue || ' ').split(' ');
			oStyle[sName + 'X']	= aValue[0];
			oStyle[sName + 'Y']	= aValue[1];
			return;
		}
	}
	//
	oStyle[sName]	= sValue;
};

//
fBrowser_attachEvent(window, "load", function(oEvent) {
	// change readystate to "loaded"
	fAML_changeReadyState("loaded");

//->Source
	oUADocument.title	= "Initializing...";
//<-Source

    // Add to document, otherwise will not render VML
	oUADocument.body.appendChild(oBrowser_factory);
    oBrowser_factory.style.display	= "none";

	// Register window event listeners
	fBrowser_attachEvent(window, "resize", fBrowser_onResize);
	fBrowser_attachEvent(window, "scroll", fBrowser_onScroll);

	// Register document event listeners
	fBrowser_attachEvent(oUADocument, "keydown",	fBrowser_onKeyDown);
	fBrowser_attachEvent(oUADocument, "keyup",		fBrowser_onKeyUp);
	fBrowser_attachEvent(oUADocument, "keypress",	fBrowser_onKeyPress);
	fBrowser_attachEvent(oUADocument, "mouseover",	fBrowser_onMouseOver);
	fBrowser_attachEvent(oUADocument, "mousemove",	fBrowser_onMouseMove);
	fBrowser_attachEvent(oUADocument, "contextmenu",fBrowser_onContextMenu);
	fBrowser_attachEvent(oUADocument, "click",		fBrowser_onClick);
	fBrowser_attachEvent(oUADocument, "dblclick",	fBrowser_onDblClick);
	fBrowser_attachEvent(oUADocument, "mousedown",	fBrowser_onMouseDown);
	fBrowser_attachEvent(oUADocument, "mouseup",	fBrowser_onMouseUp);
	if (!bGecko) {
		fBrowser_attachEvent(oUADocument.body, "mousewheel",	fBrowser_onMouseWheel);
		if (bTrident)
			fBrowser_attachEvent(oUADocument, "selectstart",	fBrowser_onSelectStart);
	}
	else
		fBrowser_attachEvent(oUADocument.body, "DOMMouseScroll",	fBrowser_onMouseWheel);

	// Register touch events
	fBrowser_attachEvent(oUADocument, "touchstart",		fBrowser_onTouch);
	fBrowser_attachEvent(oUADocument, "touchmove",		fBrowser_onTouch);
	fBrowser_attachEvent(oUADocument, "touchend",		fBrowser_onTouch);
	fBrowser_attachEvent(oUADocument, "touchcancel",	fBrowser_onTouch);
	fBrowser_attachEvent(oUADocument, "gesturestart",	fBrowser_onGesture);
	fBrowser_attachEvent(oUADocument, "gesturechange",	fBrowser_onGesture);
	fBrowser_attachEvent(oUADocument, "gestureend",		fBrowser_onGesture);

	// Initialize
	// When running in Air, start in sync with onload
	if (bWebKit && window.runtime)
		fAML_initialize();
	else
		fSetTimeout(fAML_initialize, 0);
});

fBrowser_attachEvent(window, "unload", function(oEvent) {
//->Source
	oUADocument.title	= "Finalizing...";
//<-Source

    // Remove factory from document
	oUADocument.body.removeChild(oBrowser_factory);

    // Unregister document event listeners
	fBrowser_detachEvent(oUADocument, "keydown",	fBrowser_onKeyDown);
	fBrowser_detachEvent(oUADocument, "keyup",		fBrowser_onKeyUp);
	fBrowser_detachEvent(oUADocument, "keypress",	fBrowser_onKeyPress);
	fBrowser_detachEvent(oUADocument, "mouseover",	fBrowser_onMouseOver);
	fBrowser_detachEvent(oUADocument, "mousemove",	fBrowser_onMouseMove);
	fBrowser_detachEvent(oUADocument, "contextmenu",fBrowser_onContextMenu);
	fBrowser_detachEvent(oUADocument, "click",		fBrowser_onClick);
	fBrowser_detachEvent(oUADocument, "dblclick",	fBrowser_onDblClick);
	fBrowser_detachEvent(oUADocument, "mousedown",	fBrowser_onMouseDown);
	fBrowser_detachEvent(oUADocument, "mouseup",	fBrowser_onMouseUp);
	if (!bGecko) {
		fBrowser_detachEvent(oUADocument.body, "mousewheel",	fBrowser_onMouseWheel);
		if (bTrident)
			fBrowser_detachEvent(oUADocument, "selectstart",	fBrowser_onSelectStart);
	}
	else
		fBrowser_detachEvent(oUADocument.body, "DOMMouseScroll",	fBrowser_onMouseWheel);

	// Unregister touch events
	fBrowser_detachEvent(oUADocument, "touchstart",		fBrowser_onTouch);
	fBrowser_detachEvent(oUADocument, "touchmove",		fBrowser_onTouch);
	fBrowser_detachEvent(oUADocument, "touchend",		fBrowser_onTouch);
	fBrowser_detachEvent(oUADocument, "touchcancel",	fBrowser_onTouch);
	fBrowser_detachEvent(oUADocument, "gesturestart",	fBrowser_onGesture);
	fBrowser_detachEvent(oUADocument, "gesturechange",	fBrowser_onGesture);
	fBrowser_detachEvent(oUADocument, "gestureend",		fBrowser_onGesture);

	// Unregister window event listeners
	fBrowser_detachEvent(window, "resize", fBrowser_onResize);
	fBrowser_detachEvent(window, "scroll", fBrowser_onScroll);

	// Finalize
	fAML_finalize();
});

function fAML_changeReadyState(sValue) {
	//
	oAmple_document.readyState	= sValue;

	// Dispatch
	var oReadyStateChangeEvent	= new cAMLEvent;
	oReadyStateChangeEvent.initEvent("readystatechange", false, false);
	fAMLNode_dispatchEvent(oAmple_document, oReadyStateChangeEvent);
};

function fAML_initialize() {
//->Source
	oUADocument.title	= "Processing...";
//<-Source

//->Source
    var oDateCSS	= new cDate;
//<-Source

	// Process CSS stylesheets
	fAML_processStyleSheets();

//->Source
    var oDateXML	= new cDate;
//<-Source

	// Process XML markup
	fAML_processScripts();

	// change readystate to "interactive"
	fAML_changeReadyState("interactive");

	// Set documentElement style pointer object
    if (oAMLConfiguration_values["ample-use-style-property"])
    	oAmple_document.documentElement.style	= oUADocument.body.style;

	// IE background images cache fix
	try {
		if (bTrident && nVersion < 7)
			oUADocument.execCommand("BackgroundImageCache", false, true);
	} catch (oException){};

    // Fire Event
    var oEventLoad = new cAMLEvent;
    oEventLoad.initEvent("load", false, false);
    fAMLNode_dispatchEvent(oAmple_document, oEventLoad);

	// change readystate to "complete"
	fAML_changeReadyState("complete");

//->Source
	var nElements	= fAMLElement_getElementsByTagName(oAmple_document, '*').length,
		nAnonymous	= (function(){var nLength = 0; for (var sKey in oAMLDocument_all) if (oAMLDocument_all.hasOwnProperty(sKey)) nLength++; return nLength})();
	oUADocument.title	=	"Ample: " + nElements + " (+" + (nAnonymous - nElements) + " anonymous). " +
							"DHTML: " + oUADocument.getElementsByTagName('*').length + ". " +
							"CSS time: " + (oDateXML - oDateCSS) + " ms. " +
							"XML time: " + (new cDate - oDateXML) + " ms. ";
//<-Source
};

function fAML_finalize() {
	var aElements = oAmple_document.documentElement.childNodes,
		oEventUnload;
	for (var nIndex = 0; nIndex < aElements.length; nIndex++) {
	    // fire unload event on fragments
		oEventUnload = new cAMLEvent;
	    oEventUnload.initEvent("unload", false, false);
	    fAMLNode_dispatchEvent(aElements[nIndex], oEventUnload);
	}

    // fire unload event on document
    oEventUnload = new cAMLEvent;
    oEventUnload.initEvent("unload", false, false);
    fAMLNode_dispatchEvent(oAmple_document, oEventUnload);

	// free memory
    fAMLDocument_unregister(oAmple_document, oAmple_document.documentElement);
};