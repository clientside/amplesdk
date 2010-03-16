/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Events handling
function fAttachEvent(oNode, sEvent, fHandler) {
	if (bTrident)
		oNode.attachEvent("on" + sEvent, fHandler);
	else
		oNode.addEventListener(sEvent, fHandler, false);
};

function fDetachEvent(oNode, sEvent, fHandler) {
	if (bTrident)
		oNode.detachEvent("on" + sEvent, fHandler);
	else
		oNode.removeEventListener(sEvent, fHandler, false);
};

// Finds AMLElement by event target
function fGetEventTarget(oEvent) {
    return ample.$instance(oEvent.srcElement || oEvent.target) || ample.documentElement;
};

function fGetUIEventPseudo(oEvent) {
    for (var oNode = oEvent.srcElement || oEvent.target, sId, sClass; oNode; oNode = oNode.parentNode) {
        if ((sId = oNode.id) && oAML_ids[sId])
            return oNode;
		else
		if ((sClass = oNode.className) && cString(sClass || sClass.baseVal).match(/--[\w-]+/))
			return oNode;
    }
    return null;
};

function fIsDescendant(oNode, oParent) {
	for (; oNode; oNode = oNode.parentNode)
		if (oNode == oParent)
			return true;
	return false;
};

function fGetUIEventButton(oEvent) {
	var nButton	= oEvent.button;
	if (!bTrident)
		return nButton;
	if (nButton == 4)
		return 1;
	if (nButton == 2)
		return 2;
	return 0;
};

var bTrident	= false,
	bGecko		= false,
	bPresto		= false,
	bWebKit		= false,
/*	bKHTML		= false,*/
	nVersion	= 0;

if (!!document.namespaces) {
	bTrident	= true;
	nVersion	= oNavigator.userAgent.match(/MSIE ([\d.]+)/)[1];
	if (document.addEventListener)
		nVersion	= 9;
}
else
if (!!window.controllers) {
	bGecko		= true;
	nVersion	= fParseFloat(oNavigator.userAgent.match(/rv:([\d.]+)/)[1]);
}
else
if (!!window.opera) {
	bPresto		= true;
//	nVersion	= oNavigator.userAgent.match(/Presto\/([\d.]+)/)[1];
}
else
if (oNavigator.userAgent.match(/AppleWebKit\/([\d.]+)/)[1]) {
	bWebKit		= true;
}

// Private Variables
var oAML_factory	= document.createElement("span");

function fAML_render(oNode) {
	if (oNode.nodeType == cAMLNode.TEXT_NODE)
		return document.createTextNode(oNode.nodeValue);
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
					oAML_factory.innerHTML	= sHtml;
					// Return Node
				    return oAML_factory.getElementsByTagName(sTagName)[0] || null;
				}
			}
			else {
				// Add namespace declarations to the shadow content
				if (!("xmlns" + (oNode.prefix ? ':' + oNode.prefix : '') in oNode.attributes) || (oNode.namespaceURI != "http://www.w3.org/2000/svg" && oNode.namespaceURI != "http://www.w3.org/1999/xhtml"))
					sHtml	= sHtml.replace(/^(<(?:(\w+)(:))?(\w+))/, '$1 ' + "xmlns" + '$3$2="' + (oNode.namespaceURI == "http://www.w3.org/2000/svg" ? "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml") + '"');
				return document.importNode(new cDOMParser().parseFromString('<!' + "DOCTYPE" + ' ' + "#document-fragment".substr(1) + '[' + sAML_entities + ']>' + sHtml, "text/xml").documentElement, true);
			}
		}
	}
	return null;
};

function fNumberToHex(nValue, nLength) {
	var sValue	= cNumber(nValue).toString(16);
	if (sValue.length < nLength)
		sValue	= cArray(nLength + 1 - sValue.length).join('0') + sValue;
	return sValue;
};

var oAMLKeyIdentifiers	= {
	8:		"Backspace",	// "U+0008" The Backspace (Back) key
	9:		"Tab",			// "U+0009" The Horizontal Tabulation (Tab) key

	13:		"Enter",

	16:		"Shift",
	17:		"Control",
	18:		"Alt",

	20:		"CapsLock",

	27:		"Esc",			// "U+001B" The Escape (Esc) key

	33:		"PageUp",
	34:		"PageDown",
	35:		"End",
	36:		"Home",
	37:		"Left",
	38:		"Up",
	39:		"Right",
	40: 	"Down",

	45:		"Insert",
	46:		"Period",		// "U+002E" The Full Stop (period, dot, decimal point) key (.)

	91:		"Win",

	112:	"F1",
	113:	"F2",
	114:	"F3",
	115:	"F4",
	116:	"F5",
	117:	"F6",
	118:	"F7",
	119:	"F8",
	120:	"F9",
	121:	"F10",
	122:	"F11",
	123:	"F12",

	127:	"Del"/*,
	144:	"NumLock"*/
};

function fGetKeyboardEventIdentifier(oEvent) {
	return oAMLKeyIdentifiers[oEvent.keyCode] || ('U+' + fNumberToHex(oEvent.keyCode, 4)).toUpperCase();
};

function fGetKeyboardEventModifiersList(oEvent) {
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

function fEventPreventDefault(oEvent) {
    for (var nIndex = 1; nIndex < arguments.length; nIndex++)
	    if (arguments[nIndex].defaultPrevented) {
	    	if (oEvent.preventDefault)
		    	oEvent.preventDefault();
	    	return false;
	    }
    return true;
};

function fOnMouseWheel(oEvent) {
	var oTarget		= fGetEventTarget(oEvent),
		oPseudo		= fGetUIEventPseudo(oEvent),
		bPrevent	= false,
		nWheelDelta	= bGecko ? oEvent.detail : -1 * oEvent.wheelDelta / 40,
		oEventMouseWheel	= new cAMLMouseWheelEvent;

	// if modal, do not dispatch event
	if (oAML_captureNode && !fIsDescendant(oTarget, oAML_captureNode)) {
		oTarget	= oPseudo	= oAML_captureNode;
		bPrevent	= true;
	}

	// Init MouseWheel event
	oEventMouseWheel.initMouseWheelEvent("mousewheel", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, fGetUIEventButton(oEvent), null, fGetKeyboardEventModifiersList(oEvent), nWheelDelta);
	oEventMouseWheel.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oAML_modalNode || fIsDescendant(oTarget, oAML_modalNode))
    	fAMLNode_dispatchEvent(oTarget, oEventMouseWheel);
    else
    	bPrevent	= true;

    if (bPrevent)
    	oEventMouseWheel.preventDefault();

	//
	return fEventPreventDefault(oEvent, oEventMouseWheel);
};

// Key Events
function fOnKeyDown(oEvent) {
	var oTarget		= ample.activeElement || ample.documentElement,	// FF bugfix
		oPseudo		= fGetUIEventPseudo(oEvent),
		oEventKeyDown	= new cAMLKeyboardEvent;

	// if modal, do not dispatch event
	if (oAML_captureNode && !fIsDescendant(oTarget, oAML_captureNode))
		oTarget = oPseudo	= oAML_captureNode;

    // Init KeyDown event
    oEventKeyDown.initKeyboardEvent("keydown", true, true, window, fGetKeyboardEventIdentifier(oEvent), null, fGetKeyboardEventModifiersList(oEvent));
    oEventKeyDown.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oAML_modalNode || fIsDescendant(oTarget, oAML_modalNode))
    	fAMLNode_dispatchEvent(oTarget, oEventKeyDown);

	//
	return fEventPreventDefault(oEvent, oEventKeyDown);
};

function fOnKeyPress(oEvent)
{
	var oTarget		= ample.activeElement || ample.documentElement,	// FF bugfix
		oPseudo		= fGetUIEventPseudo(oEvent),
		oEventKeyPress	= new cAMLKeyboardEvent,
		oEventTextInput	= new cAMLTextEvent;

	// Filter out non-alphanumerical keypress events
	if (oEvent.ctrlKey || oEvent.altKey || oEvent.keyCode in oAMLKeyIdentifiers)
		return;

	// if modal, do not dispatch event
	if (oAML_captureNode && !fIsDescendant(oTarget, oAML_captureNode))
		oTarget = oPseudo	= oAML_captureNode;

    // Init KeyPress event
    oEventKeyPress.initKeyboardEvent("keypress", true, true, window, fGetKeyboardEventIdentifier(oEvent), null, fGetKeyboardEventModifiersList(oEvent));
	oEventKeyPress.$pseudoTarget	= oPseudo;

	// Init TextInput event
	oEventTextInput.initTextEvent("textInput", true, true, null, cString.fromCharCode(oEvent.charCode || oEvent.keyCode));
    oEventTextInput.$pseudoTarget	= oPseudo;

    if (!oAML_modalNode || fIsDescendant(oTarget, oAML_modalNode)) {
    	//
    	fAMLNode_dispatchEvent(oTarget, oEventKeyPress);
		//
    	fAMLNode_dispatchEvent(oTarget, oEventTextInput);
    }

	//
	return fEventPreventDefault(oEvent, oEventKeyPress, oEventTextInput);
};

function fOnKeyUp(oEvent) {
	var oTarget		= ample.activeElement || ample.documentElement,
		oPseudo		= fGetUIEventPseudo(oEvent),
		oEventKeyUp	= new cAMLKeyboardEvent;

	// if modal, do not dispatch event
	if (oAML_captureNode && !fIsDescendant(oTarget, oAML_captureNode))
		oTarget	= oPseudo	= oAML_captureNode;

    // Init KeyUp event
	oEventKeyUp.initKeyboardEvent("keyup", true, true, window, fGetKeyboardEventIdentifier(oEvent), null, fGetKeyboardEventModifiersList(oEvent));
	oEventKeyUp.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oAML_modalNode || fIsDescendant(oTarget, oAML_modalNode))
    	fAMLNode_dispatchEvent(oTarget, oEventKeyUp);

	//
	return fEventPreventDefault(oEvent, oEventKeyUp);
};

function fOnMouseOver(oEvent) {
	var oTarget		= fGetEventTarget(oEvent),
		oPseudo		= fGetUIEventPseudo(oEvent),
		nButton 	= fGetUIEventButton(oEvent),
		oEventMouseOver,
		oEventMouseOut;

	if (oTarget == oAML_mouseNode)
		return;

	// if modal, do not dispatch event
	if (oAML_captureNode && !fIsDescendant(oTarget, oAML_captureNode))
		oTarget	= oPseudo	= oAML_captureNode;

	// TODO: Remove this dependency from here
	if (!(nAMLDragAndDrop_dragState || nAMLResize_resizeState)) {
		// do not dispatch event if outside modal
	    if (!oAML_modalNode || fIsDescendant(oAML_mouseNode, oAML_modalNode)) {
			if (oAML_mouseNode && oAML_all[oAML_mouseNode.uniqueID]) {
			    // Create an Event
			    oEventMouseOut = new cAMLMouseEvent;
			    oEventMouseOut.initMouseEvent("mouseout", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, oTarget);
				oEventMouseOut.$pseudoTarget	= oPseudo;
				fAMLNode_dispatchEvent(oAML_mouseNode, oEventMouseOut);
			}
	    }

		// do not dispatch event if outside modal
	    if (!oAML_modalNode || fIsDescendant(oTarget, oAML_modalNode)) {
		    // Create an Event
		    oEventMouseOver = new cAMLMouseEvent;
		    oEventMouseOver.initMouseEvent("mouseover", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, oAML_mouseNode);
		    oEventMouseOver.$pseudoTarget	= oPseudo;
		    fAMLNode_dispatchEvent(oTarget, oEventMouseOver);
	    }
	}

	//
	oAML_mouseNode	= oTarget;
};

/*
document.attachEvent("on" + "mouseover", function(oEvent) {
	var oTarget		= fGetEventTarget(oEvent),
		oPseudo		= fGetUIEventPseudo(oEvent);
    // Create an Event
    var oEventMouseOver = new cAMLMouseEvent;
    oEventMouseOver.initMouseEvent("mouseover", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, oEvent.button, null);
    oEventMouseOver.$pseudoTarget	= oPseudo;
	fAMLNode_dispatchEvent(oTarget, oEventMouseOver);
});

document.attachEvent("on" + "mouseout", function(oEvent) {
	var oTarget		= fGetEventTarget(oEvent),
		oPseudo		= fGetUIEventPseudo(oEvent);
    // Create an Event
    var oEventMouseOut = new cAMLMouseEvent;
    oEventMouseOut.initMouseEvent("mouseout", true, false, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, oEvent.button, null);
    oEventMouseOut.$pseudoTarget	= oPseudo;
	fAMLNode_dispatchEvent(oTarget, oEventMouseOut);
});
*/

var oAML_captureNode= null,	// Set in Capture manager
	oAML_modalNode	= null,	// Set in Capture manager
	aAML_mouseNodes	= new cAMLNodeList,
	oAML_mouseNode	= null;

function fOnMouseMove(oEvent) {
    var oTarget		= fGetEventTarget(oEvent),
    	oPseudo		= fGetUIEventPseudo(oEvent),
    	nButton 	= fGetUIEventButton(oEvent),
    	nIndexCommon=-1,
    	aElements	= new cAMLNodeList,
    	oEventMouseMove = new cAMLMouseEvent,
    	oEventMouseLeave,
		oEventMouseEnter;

	//
	if (oAML_captureNode && !fIsDescendant(oTarget, oAML_captureNode))
		oTarget	= oPseudo	= oAML_captureNode;

	// TODO: Remove this dependency from here
	if (!(nAMLDragAndDrop_dragState || nAMLResize_resizeState)) {
		if (aAML_mouseNodes[0] != oTarget) {
			// find common relative
			for (var oElement = oTarget; oElement.nodeType != cAMLNode.DOCUMENT_NODE; oElement = oElement.parentNode) {
				aElements.$add(oElement);
				if (nIndexCommon ==-1)
					nIndexCommon = aAML_mouseNodes.$indexOf(oElement);
			}

			// TODO: Come up with a better implementation that doesn't check for modality on every iteration in loops

			// propagate mouseleave branch
			for (var nIndex = 0; nIndex < nIndexCommon; nIndex++) {
				// do not dispatch event if outside modal
				if (!oAML_modalNode || fIsDescendant(aAML_mouseNodes[nIndex], oAML_modalNode)) {
					oEventMouseLeave = new cAMLMouseEvent;
				    oEventMouseLeave.initMouseEvent("mouseleave", false, false, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, aAML_mouseNodes[nIndex + 1] || null);
				    oEventMouseLeave.$pseudoTarget	= oPseudo;
				    fAMLNode_dispatchEvent(aAML_mouseNodes[nIndex], oEventMouseLeave);
				}
			}

			// propagate mouseenter branch
			for (var nIndex	= nIndexCommon + aElements.length - aAML_mouseNodes.length; nIndex > 0; nIndex--) {
				// do not dispatch event if outside modal
				if (!oAML_modalNode || fIsDescendant(aElements[nIndex - 1], oAML_modalNode)) {
				    oEventMouseEnter = new cAMLMouseEvent;
				    oEventMouseEnter.initMouseEvent("mouseenter", false, false, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, aElements[nIndex] || null);
				    oEventMouseEnter.$pseudoTarget	= oPseudo;
				    fAMLNode_dispatchEvent(aElements[nIndex - 1], oEventMouseEnter);
				}
		    }

			// save current path stack
			aAML_mouseNodes	= aElements;
		}
	}

	// scope to modal
    if (oAML_modalNode && fIsDescendant(oTarget, oAML_modalNode))
    	oTarget	= oAML_modalNode;

    // Init MouseMove event
    oEventMouseMove.initMouseEvent("mousemove", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, null);
    oEventMouseMove.$pseudoTarget	= oPseudo;
    fAMLNode_dispatchEvent(oTarget, oEventMouseMove);

	//
	return fEventPreventDefault(oEvent, oEventMouseMove);
};

function fOnContextMenu(oEvent) {
	var oTarget		= fGetEventTarget(oEvent),
		oPseudo		= fGetUIEventPseudo(oEvent),
		nButton 	= fGetUIEventButton(oEvent),
		bPrevent	= false,
		oEventClick	= new cAMLMouseEvent,
		oEventContextMenu	= new cAMLMouseEvent;

	// if modal, do not dispatch event
	if (oAML_captureNode && !fIsDescendant(oTarget, oAML_captureNode)) {
		oTarget	= oPseudo	= oAML_captureNode;
		bPrevent	= true;
	}

	// Init Click event
	oEventClick.initMouseEvent("click", true, true, window, oEvent.detail || 1, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, null, 2, null);
	oEventClick.$pseudoTarget	= oPseudo;

    // Init ContextMenu event
    oEventContextMenu.initMouseEvent("contextmenu", true, true, window, oEvent.detail || 1, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, 2, null);
    oEventContextMenu.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oAML_modalNode || fIsDescendant(oTarget, oAML_modalNode)) {
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
	return fEventPreventDefault(oEvent, oEventContextMenu, oEventClick);
};

function fOnClick(oEvent) {
	var oTarget		= fGetEventTarget(oEvent),
		oPseudo		= fGetUIEventPseudo(oEvent),
		nButton		= fGetUIEventButton(oEvent),
		bPrevent	= false,
		oEventClick	= new cAMLMouseEvent;

	// if modal, do not dispatch event
	if (oAML_captureNode && !fIsDescendant(oTarget, oAML_captureNode)) {
		oTarget	= oPseudo	= oAML_captureNode;
		bPrevent	= true;
	}
	// Init Click event
    oEventClick.initMouseEvent("click", true, true, window, oEvent.detail || 1, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, null);
    oEventClick.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oAML_modalNode || fIsDescendant(oTarget, oAML_modalNode))
    	fAMLNode_dispatchEvent(oTarget, oEventClick);
    else
    	bPrevent	= true;

	if (bPrevent)
		oEventClick.preventDefault();

	//
	return fEventPreventDefault(oEvent, oEventClick);
};

function fOnDblClick(oEvent) {
	var oTarget		= fGetEventTarget(oEvent),
		oPseudo		= fGetUIEventPseudo(oEvent),
		nButton		= fGetUIEventButton(oEvent),
		oEventDblClick = new cAMLMouseEvent,
		oEventClick,
		oEventMouseDown,
		oEventMouseUp;

	// if modal, do not dispatch event
	if (oAML_captureNode && !fIsDescendant(oTarget, oAML_captureNode))
		oTarget	= oPseudo	= oAML_captureNode;

	// Init DblClick event
    oEventDblClick.initMouseEvent("dblclick", true, true, window, oEvent.detail || 2, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, null);
    oEventDblClick.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oAML_modalNode || fIsDescendant(oTarget, oAML_modalNode)) {
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

function fOnMouseDown(oEvent) {
	var oTarget		= fGetEventTarget(oEvent),
		oPseudo		= fGetUIEventPseudo(oEvent),
		nButton		= fGetUIEventButton(oEvent),
		bCapture	= false,
		bModal		= false,
		oEventMouseDown = new cAMLMouseEvent;

	// change target if some element is set to receive capture
	if (oAML_captureNode && !fIsDescendant(oTarget, oAML_captureNode)) {
		oTarget	= oPseudo	= oAML_captureNode;
		bCapture	= true;
	}

	// Init MouseDown event
    oEventMouseDown.initMouseEvent("mousedown", true, true, window, oEvent.detail || 1, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, null);
    oEventMouseDown.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
	if (!oAML_modalNode || fIsDescendant(oTarget, oAML_modalNode)) {
		// Moved here from #mouseup handler. Not sure yet if it is right though
		ample.activeElement	= oTarget.nodeType != cAMLNode.DOCUMENT_NODE ? oTarget : null;
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
		fAMLNode_dispatchEvent(bModal ? oAML_modalNode : oTarget, oCaptureEvent);
		//
		oEventMouseDown.preventDefault();
	}

	// toggle user-selection (IE only)
	if (oEventMouseDown.defaultPrevented)
		bAML_userSelect	= false;

	//
	return fEventPreventDefault(oEvent, oEventMouseDown);
};

function fOnMouseUp(oEvent) {
	var oTarget		= fGetEventTarget(oEvent),
		oPseudo		= fGetUIEventPseudo(oEvent),
		nButton		= fGetUIEventButton(oEvent),
		oEventMouseUp	= new cAMLMouseEvent;

	// change target if some element is set to receive capture
	if (oAML_captureNode && !fIsDescendant(oTarget, oAML_captureNode))
		oTarget	= oPseudo	= oAML_captureNode;

	// Init MouseUp event
    oEventMouseUp.initMouseEvent("mouseup", true, true, window, oEvent.detail || 1, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, null);
    oEventMouseUp.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
	if (!oAML_modalNode || fIsDescendant(oTarget, oAML_modalNode))
		fAMLNode_dispatchEvent(oTarget, oEventMouseUp);

	//
	return fEventPreventDefault(oEvent, oEventMouseUp);
};

function fOnResize(oEvent) {
    // Create an Event
    var oEventResize = new cAMLUIEvent;
    oEventResize.initUIEvent("resize", true, false, window, null);
    fAMLNode_dispatchEvent(ample, oEventResize);
};

function fOnScroll(oEvent) {
    // Create an Event
    var oEventScroll = new cAMLUIEvent;
    oEventScroll.initUIEvent("scroll", true, false, window, null);
    fAMLNode_dispatchEvent(ample, oEventScroll);
};

// User selection
var bAML_userSelect	= true;
function fOnSelectStart() {
	var bUserSelect	= bAML_userSelect;
	bAML_userSelect	= true;
	return bUserSelect;
};

function fAML_toggleSelect(bAllow) {
	if (bTrident)
		bAML_userSelect	= bAllow;
	else {
		var oStyle	= document.documentElement.style;
		oStyle.WebkitUserSelect	=
		oStyle.MozUserSelect	=
		oStyle.OperaUserSelect	=
		oStyle.KhtmlUserSelect 	=
		oStyle.userSelect		= bAllow ? '' : "none";
	}
};

// Utilities
function fAML_replaceNode(oOld, oNew) {
	oOld.parentNode.insertBefore(oNew, oOld);
	oOld.parentNode.removeChild(oOld);
};

function fAML_getResponseDocument(oRequest) {
	var oDocument	= oRequest.responseXML;
	// Try parsing responseText
	if (bTrident && oDocument && !oDocument.documentElement && oRequest.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/)) {
		oDocument	= new fActiveXObject("Microsoft.XMLDOM");
		oDocument.loadXML(oRequest.responseText);
	}
	// Check if there is no error in document
	if (oDocument)
		if ((bTrident && oDocument.parseError != 0) || !oDocument.documentElement || (oDocument.documentElement && oDocument.documentElement.tagName == "parsererror"))
			return null;
	return oDocument;
};

function fAML_parseStyleSheet(sCSS, sUri) {
	// 1. Remove namespace declarations
	var aNameSpaces = sCSS.match(/@namespace\s+([\w-]+\s+)?(url\()?(['"])?[^'";\s]+(['"])?\)?;?/g);
	if (aNameSpaces)
		for (var nIndex = 0; nIndex < aNameSpaces.length; nIndex++)
			sCSS	= sCSS.replace(aNameSpaces[nIndex], '');

	// 2. Rewrite Relative URLs
	var aCSS	= sCSS.match(/url\s*\([^\)]+\)/g);
	if (aCSS)
		for (var nIndex = 0, nLength = aCSS.length, aUrl; nIndex < nLength; nIndex++)
			if (aUrl = aCSS[nIndex].match(/url\s*\(['"]?([^\)"']+)['"]?\)/i))
				sCSS	= sCSS.replace(aCSS[nIndex], "url" + '("' + fAML_resolveUri(aUrl[1], sUri) + '")');

	// 3. Process imports
	var aImports	= sCSS.match(/@import\s+url\s*\(\s*['"]?[^'"]+['"]?\s*\)\s*;?/g);
	if (aImports)
		for (var nIndex = 0, nLength = aImports.length; nIndex < nLength; nIndex++)
			if (aUrl = aImports[nIndex].match(/url\s*\(['"]?([^\)"']+)['"]?\)/i))
				sCSS	= sCSS.replace(aImports[nIndex], fAML_parseStyleSheet(fAML_loadStyleSheet(aUrl[1]), aUrl[1]));

	// 4. Convert styles
	if (bTrident) {
		// Rewrite display:inline-block to display:inline (IE8-)
		if (nVersion < 8)
			sCSS	= sCSS.replace(/display\s*:\s*inline-block/g, 'display:inline;zoom:1');
		// Rewrite opacity
		sCSS	= sCSS.replace(/(?:[^-])opacity\s*:\s*([\d.]+)/g, function(sMatch, nOpacity) {
			return "filter" + ':' + "Alpha" + '(' + "opacity" + '=' + nOpacity * 100 + ');' + "opacity" + ':' + nOpacity;
		});
	}

	// 5. Modify selectors
//var d=new Date;
	var aCSS	= [],
		aRules	= sCSS.match(/[^{]+{[^}]*}/g);
	if (aRules) {
		for (var nIndex = 0, nLength = aRules.length, aRule; nIndex < nLength; nIndex++) {
			aRule	= aRules[nIndex].match(/([^{]+)({[^}]*})/);
			aCSS.push(aRule[1]
//						.replace(/([\s>+~,])(?:([\w]+)\|)?([\w]+)/g, '$1.$2-$3')		// Element
						.replace(/\|/g, '-')							// Namespace
						.replace(/([\s>+~,]|not\()([\w])/g, '$1.$2')	// Element
						.replace(/\[([\w]+)=?([\w]+)?\]/g, '-$1-$2')	// Attribute
						.replace(/::/g, '--')							// Pseudo-element
						.replace(/:nth-child\((\d+)\)/g, '_nth-child-$1')	// Pseudo-class nth-child
						.replace(/:(?!last-child|first-child|not)/g, '_')	// Pseudo-class
//						.replace(/>/g, '--' + "gateway" + '>').replace(/(--gateway){2,}/g, '--' + "gateway")// > selector
						,
						aRule[2]);
		}
		sCSS	= aCSS.join('');
	}

//console.log(new Date - d);

/*
	// 4. Modify element names
	sCSS	= sCSS
			// strip comments
//			.replace(/\/\*.+\*\//g, '')
			// CSS3-NS (namespace)	ns|element				-> .ns-element
			.replace(/([\w]+)\|([\w]+)/g, '.$1-$2')
			// Classes names 		element.class			-> element-class
//			.replace(/(^|[},]\s*)([\w]+)\.([\w]+)/g, '$1$2-$3')
			// CSS2-Attribute		element[attribute=value]-> element-attribute-value
			.replace(/\[([\w]+)=?([\w]+)?\]/g, '-$1-$2')
			// CSS3-UI (psd-elem)	element::input			-> element--input
			.replace(/([\w-]+)::([\w-]+)/g, '$1--$2')
			// CSS3-UI (psd-class)	element:hover			-> element_hover
//			.replace(/([\w]+):([\w-]+)(\s*[{,*.])/g, '$1_$2$3')
			.replace(/([\w]+):(?!last-child|first-child)([\w-]+)(\s*[{,*.])/g, '$1_$2$3')	// CSS3-UI "element:hover"
			;
*/

	return sCSS;
};

function fAML_loadStyleSheet(sUri) {
	var oRequest	= new cXMLHttpRequest;
	oRequest.open("GET", sUri, false);
	oRequest.setRequestHeader("Accept", "text/css" + ',*' + '/' + '*;q=0.1');
	oRequest.send(null);

	return oRequest.responseText;
};

function fAML_createStyleSheet(sCSS, sUri, sMedia) {
	// Process Stylesheet
	oAML_factory.innerHTML	= "#text" + '<' + "style" + ' ' + "type" + '="' + "text/css" + '"' + (sMedia ? ' ' + "media" + '="' + sMedia + '"' : '') + '>' + fAML_parseStyleSheet(sCSS, sUri) + '</' + "style" + '>';
	return oAML_factory.childNodes[1];
};

function fAML_toCssPropertyName(sName) {
	for (var nIndex = 1, aValue = sName.split('-'); nIndex < aValue.length; nIndex++)
    	aValue[nIndex] = aValue[nIndex].substr(0, 1).toUpperCase() + aValue[nIndex].substr(1);
	return aValue.join('');
};

function fAML_getComputedStyle(oElementDOM) {
	return oElementDOM.currentStyle || window.getComputedStyle(oElementDOM, null);
};

//
fAttachEvent(window, "load", function(oEvent) {
	// change readystate to "loading"
	fAML_changeReadyState(1);

//->Source
	document.title	= "Initializing...";
//<-Source

    // Add to document, otherwise will not render VML
    document.body.appendChild(oAML_factory);
    oAML_factory.style.display	= "none";

	// Register window event listeners
	fAttachEvent(window, "resize", fOnResize);
	fAttachEvent(window, "scroll", fOnScroll);

	// Register document event listeners
	fAttachEvent(document, "keydown",	fOnKeyDown);
	fAttachEvent(document, "keyup",		fOnKeyUp);
	fAttachEvent(document, "keypress",	fOnKeyPress);
	fAttachEvent(document, "mouseover",	fOnMouseOver);
	fAttachEvent(document, "mousemove",	fOnMouseMove);
	fAttachEvent(document, "contextmenu",fOnContextMenu);
	fAttachEvent(document, "click",		fOnClick);
	fAttachEvent(document, "dblclick",	fOnDblClick);
	fAttachEvent(document, "mousedown",	fOnMouseDown);
	fAttachEvent(document, "mouseup",	fOnMouseUp);
	if (!bGecko) {
		fAttachEvent(document.body, "mousewheel",		fOnMouseWheel);
		if (bTrident)
			fAttachEvent(document, "selectstart", fOnSelectStart);
	}
	else
		fAttachEvent(document.body, "DOMMouseScroll",	fOnMouseWheel);

	// Initialize
	// When running in Air, start in sync with onload
	if (bWebKit && window.runtime)
		fAML_initialize();
	else
		fSetTimeout(fAML_initialize, 0);
});

fAttachEvent(window, "unload", function(oEvent) {
//->Source
	document.title	= "Finalizing...";
//<-Source

    // Remove factory from document
    document.body.removeChild(oAML_factory);

    // Unregister document event listeners
	fDetachEvent(document, "keydown",	fOnKeyDown);
	fDetachEvent(document, "keyup",		fOnKeyUp);
	fDetachEvent(document, "keypress",	fOnKeyPress);
	fDetachEvent(document, "mouseover",	fOnMouseOver);
	fDetachEvent(document, "mousemove",	fOnMouseMove);
	fDetachEvent(document, "contextmenu",fOnContextMenu);
	fDetachEvent(document, "click",		fOnClick);
	fDetachEvent(document, "dblclick",	fOnDblClick);
	fDetachEvent(document, "mousedown",	fOnMouseDown);
	fDetachEvent(document, "mouseup",	fOnMouseUp);
	if (!bGecko) {
		fDetachEvent(document.body, "mousewheel",		fOnMouseWheel);
		if (bTrident)
			fDetachEvent(document, "selectstart", fOnSelectStart);
	}
	else
		fDetachEvent(document.body, "DOMMouseScroll",	fOnMouseWheel);

	// Unregister window event listeners
	fDetachEvent(window, "resize", fOnResize);
	fDetachEvent(window, "scroll", fOnScroll);

	// Finalize
	fAML_finalize();
});
