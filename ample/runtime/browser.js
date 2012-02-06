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
	oBrowser_root		= oUADocument.documentElement,
	oBrowser_head		= null,
	oBrowser_body		= null,
	hBrowser_keyIdentifiers	= fUtilities_stringToHash("8:Backspace;9:Tab;13:Enter;16:Shift;17:Control;18:Alt;20:CapsLock;27:Esc;33:PageUp;34:PageDown;35:End;36:Home;37:Left;38:Up;39:Right;40:Down;45:Insert;46:Backspace;91:Win;112:F1;113:F2;114:F3;115:F4;116:F5;117:F6;118:F7;119:F8;120:F9;121:F10;122:F11;123:F12;127:Del"),
	hBrowser_cssColors		= fUtilities_stringToHash("aliceblue:F0F8FF;antiquewhite:FAEBD7;aqua:00FFFF;aquamarine:7FFFD4;azure:F0FFFF;beige:F5F5DC;bisque:FFE4C4;black:000000;blanchedalmond:FFEBCD;blue:0000FF;blueviolet:8A2BE2;brown:A52A2A;burlywood:DEB887;cadetblue:5F9EA0;chartreuse:7FFF00;chocolate:D2691E;coral:FF7F50;cornflowerblue:6495ED;cornsilk:FFF8DC;crimson:DC143C;cyan:00FFFF;darkblue:00008B;darkcyan:008B8B;darkgoldenrod:B8860B;darkgray:A9A9A9;darkgreen:006400;darkkhaki:BDB76B;darkmagenta:8B008B;darkolivegreen:556B2F;darkorange:FF8C00;darkorchid:9932CC;darkred:8B0000;darksalmon:E9967A;darkseagreen:8FBC8F;darkslateblue:483D8B;darkslategray:2F4F4F;darkturquoise:00CED1;darkviolet:9400D3;deeppink:FF1493;deepskyblue:00BFFF;dimgray:696969;dodgerblue:1E90FF;firebrick:B22222;floralwhite:FFFAF0;forestgreen:228B22;fuchsia:FF00FF;gainsboro:DCDCDC;ghostwhite:F8F8FF;gold:FFD700;goldenrod:DAA520;gray:808080;green:008000;greenyellow:ADFF2F;honeydew:F0FFF0;hotpink:FF69B4;indianred:CD5C5C;indigo:4B0082;ivory:FFFFF0;khaki:F0E68C;lavender:E6E6FA;lavenderblush:FFF0F5;lawngreen:7CFC00;lemonchiffon:FFFACD;lightblue:ADD8E6;lightcoral:F08080;lightcyan:E0FFFF;lightgoldenrodyellow:FAFAD2;lightgreen:90EE90;lightgrey:D3D3D3;lightpink:FFB6C1;lightsalmon:FFA07A;lightseagreen:20B2AA;lightskyblue:87CEFA;lightslategray:778899;lightsteelblue:B0C4DE;lightyellow:FFFFE0;lime:00FF00;limegreen:32CD32;linen:FAF0E6;magenta:FF00FF;maroon:800000;mediumaquamarine:66CDAA;mediumblue:0000CD;mediumorchid:BA55D3;mediumpurple:9370DB;mediumseagreen:3CB371;mediumslateblue:7B68EE;mediumspringgreen:00FA9A;mediumturquoise:48D1CC;mediumvioletred:C71585;midnightblue:191970;mintcream:F5FFFA;mistyrose:FFE4E1;moccasin:FFE4B5;navajowhite:FFDEAD;navy:000080;oldlace:FDF5E6;olive:808000;olivedrab:6B8E23;orange:FFA500;orangered:FF4500;orchid:DA70D6;palegoldenrod:EEE8AA;palegreen:98FB98;paleturquoise:AFEEEE;palevioletred:DB7093;papayawhip:FFEFD5;peachpuff:FFDAB9;peru:CD853F;pink:FFC0CB;plum:DDA0DD;powderblue:B0E0E6;purple:800080;red:FF0000;rosybrown:BC8F8F;royalblue:4169E1;saddlebrown:8B4513;salmon:FA8072;sandybrown:F4A460;seagreen:2E8B57;seashell:FFF5EE;sienna:A0522D;silver:C0C0C0;skyblue:87CEEB;slateblue:6A5ACD;slategray:708090;snow:FFFAFA;springgreen:00FF7F;steelblue:4682B4;tan:D2B48C;teal:008080;thistle:D8BFD8;tomato:FF6347;turquoise:40E0D0;violet:EE82EE;wheat:F5DEB3;white:FFFFFF;whitesmoke:F5F5F5;yellow:FFFF00;yellowgreen:9ACD32", '#'),
    hBrowser_entities   = {},
	aBrowser_mouseNodes	= new cNodeList,
	oBrowser_mouseNode	= null,
	oBrowser_captureNode= null,		// Set in Capture manager
	oBrowser_modalNode	= null,		// Set in Capture manager
	bBrowser_mouseDown	= false,
	bBrowser_keyDown	= false,	// Holds keydown state
	bBrowser_userSelect	= true;

// Events handling
function fBrowser_attachEvent(oNode, sType, fHandler) {
	if (oNode.addEventListener)
		oNode.addEventListener(sType, fHandler, false);
	else
		oNode.attachEvent('on' + sType, fHandler);
};

function fBrowser_detachEvent(oNode, sType, fHandler) {
	if (oNode.removeEventListener)
		oNode.removeEventListener(sType, fHandler, false);
	else
		oNode.detachEvent('on' + sType, fHandler);
};

// Finds Element by event target
function fBrowser_getEventTarget(oEvent) {
    return fAmple_instance(oAmple_document, oEvent.srcElement || oEvent.target) || oAmple_root;
};

function fBrowser_getUIEventPseudo(oEvent) {
    for (var oNode = oEvent.srcElement || oEvent.target, sId, sClass; oNode; oNode = oNode.parentNode) {
        if ((sId = oNode.id) && oDocument_all[sId])
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
	if (oNode.nodeType == 3)	// cNode.TEXT_NODE
		return oUADocument.createTextNode(oNode.nodeValue);
	else
	if (oNode.nodeType == 1) {	// cNode.ELEMENT_NODE
		var sHtml	= oNode.$getTag();
		if (sHtml) {
			if (bTrident) {
				if (sHtml.match(/^<(\w*:)?(\w+)/)) {
					var sTagName	= cRegExp.$2;
					switch (sTagName) {
						case 'td':
						case 'th':
							sHtml	= '<tr>' + sHtml + '</tr>';
							// no break is left intentionally
						case 'tr':
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
				if (!("xmlns" + (oNode.prefix ? ':' + oNode.prefix : '') in oNode.attributes) || (oNode.namespaceURI != sNS_SVG && oNode.namespaceURI != sNS_XHTML))
					sHtml	= sHtml.replace(/^(<(?:(\w+)(:))?(\w+))/, '$1 ' + "xmlns" + '$3$2="' + (oNode.namespaceURI == sNS_SVG ? sNS_SVG : sNS_XHTML) + '"');
				return oUADocument.importNode(fBrowser_parseXML('<!' + "DOCTYPE" + ' ' + "div" + '[' + sBrowser_entities + ']>' + sHtml).documentElement, true);
			}
		}
	}
	return null;
};

// User selection
function fBrowser_getKeyboardEventIdentifier(oEvent) {
	return hBrowser_keyIdentifiers[oEvent.keyCode] || 'U+' + ("0000" + oEvent.keyCode.toString(16).toUpperCase()).slice(-4);
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

function fBrowser_eventPreventDefault(oEventOriginal, oEvent) {
    if (oEvent.defaultPrevented) {
    	if (oEventOriginal.preventDefault)
    		oEventOriginal.preventDefault();
    	return false;
    }
    return true;
};

function fBrowser_onMouseWheel(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		bPrevent	= false,
		nWheelDelta	= bGecko ? -40 * oEvent.detail : oEvent.wheelDelta,
		oEventWheel	= new cWheelEvent;

	// Let me know how would you feature-detect this
	if (oUANavigator.platform == "MacIntel")
		if (bPresto || bGecko)
			nWheelDelta	*= 3;
	// Opera 9.5 corrected sign
	if (bPresto && nVersion < 2.1)
		nWheelDelta	*=-1;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
		bPrevent	= true;
	}

	// Init MouseWheel event
	oEventWheel.initWheelEvent("mousewheel", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, fBrowser_getUIEventButton(oEvent), null, fBrowser_getKeyboardEventModifiersList(oEvent), 0, nWheelDelta, 0, 0);
	oEventWheel.$pseudoTarget	= oPseudo;
	oEventWheel.wheelDelta		= oEventWheel.deltaY;

	// do not dispatch event if outside modal
    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode))
    	fNode_dispatchEvent(oTarget, oEventWheel);
    else
    	bPrevent	= true;

    if (bPrevent)
    	oEventWheel.preventDefault();

	//
	return fBrowser_eventPreventDefault(oEvent, oEventWheel);
};

// Key Events
function fBrowser_onKeyDown(oEvent) {
	var oTarget		= oAmple.activeElement || oAmple_root,	// FF bugfix
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		oEventKeyDown	= new cKeyboardEvent;

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
    	fNode_dispatchEvent(oTarget, oEventKeyDown);

	//
	return fBrowser_eventPreventDefault(oEvent, oEventKeyDown);
};

function fBrowser_onKeyPress(oEvent)
{
	// Opera doesn't repeat keydown, but does repeat keypress
	if ((bPresto || (bGecko && nVersion < 2)) && bBrowser_keyDown)
		fBrowser_onKeyDown(oEvent);

    // Fix for repeated keydown in presto
    bBrowser_keyDown	= true;

	// Filter out non-alphanumerical keypress events
	if (oEvent.ctrlKey || oEvent.altKey || oEvent.keyCode in hBrowser_keyIdentifiers)
		return;

	var oTarget		= oAmple.activeElement || oAmple_root,	// FF bugfix
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		oEventKeyPress	= new cKeyboardEvent,
		oEventTextInput	= new cTextEvent;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
	}

    // Init KeyPress event
    oEventKeyPress.initKeyboardEvent("keypress", true, true, window, fBrowser_getKeyboardEventIdentifier(oEvent), null, fBrowser_getKeyboardEventModifiersList(oEvent));
	oEventKeyPress.$pseudoTarget	= oPseudo;

	// Init TextInput event
	oEventTextInput.initTextEvent("textinput", true, true, window, cString.fromCharCode(oEvent.charCode || oEvent.keyCode), 1 /* TextEvent.DOM_INPUT_METHOD_KEYBOARD */, '');
    oEventTextInput.$pseudoTarget	= oPseudo;

    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode)) {
    	//
    	fNode_dispatchEvent(oTarget, oEventKeyPress);
		//
    	fNode_dispatchEvent(oTarget, oEventTextInput);
    	//
    	if (oEventTextInput.defaultPrevented)
    		oEventKeyPress.preventDefault();
    }

	//
	return fBrowser_eventPreventDefault(oEvent, oEventKeyPress);
};

function fBrowser_onKeyUp(oEvent) {
	var oTarget		= oAmple.activeElement || oAmple_root,
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		oEventKeyUp	= new cKeyboardEvent;

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
    	fNode_dispatchEvent(oTarget, oEventKeyUp);

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
	if (!(nDragAndDropManager_dragState || nResizeManager_resizeState)) {
		// do not dispatch event if outside modal
	    if (!oBrowser_modalNode || fBrowser_isDescendant(oBrowser_mouseNode, oBrowser_modalNode)) {
			if (oBrowser_mouseNode && oDocument_all[oBrowser_mouseNode.uniqueID]) {
			    // Create an Event
			    oEventMouseOut = new cMouseEvent;
			    oEventMouseOut.initMouseEvent("mouseout", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, oTarget);
				oEventMouseOut.$pseudoTarget	= oPseudo;
				fNode_dispatchEvent(oBrowser_mouseNode, oEventMouseOut);
			}
	    }

		// do not dispatch event if outside modal
	    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode)) {
		    // Create an Event
		    oEventMouseOver = new cMouseEvent;
		    oEventMouseOver.initMouseEvent("mouseover", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, oBrowser_mouseNode);
		    oEventMouseOver.$pseudoTarget	= oPseudo;
		    fNode_dispatchEvent(oTarget, oEventMouseOver);
	    }
	}

	//
	oBrowser_mouseNode	= oTarget;
};

// Touches
function fBrowser_getTouches(oUATouches) {
	var nIndex	= 0,
		nLength	= oUATouches.length,
		oTouches	= new cTouchList,
		oTouch,
		oUATouch;
	while (nIndex < nLength) {
		oUATouch	= oUATouches.item(nIndex++);
		oTouch		= new cTouch;
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
		oEventTouch	= new cTouchEvent;

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
    	fNode_dispatchEvent(oTarget, oEventTouch);

	//
	return fBrowser_eventPreventDefault(oEvent, oEventTouch);
};

function fBrowser_onGesture(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		oEventGesture	= new cGestureEvent;

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
    	fNode_dispatchEvent(oTarget, oEventGesture);

	//
	return fBrowser_eventPreventDefault(oEvent, oEventGesture);
};

function fBrowser_onClipboard(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		oEventClipboard	= new cClipboardEvent;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
	}

    // Init Clipboard event
	oEventClipboard.initClipboardEvent(oEvent.type, oEvent.bubbles, oEvent.cancelable, "", null);
	oEventClipboard.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode))
    	fNode_dispatchEvent(oTarget, oEventClipboard);

	//
	return fBrowser_eventPreventDefault(oEvent, oEventClipboard);
};

/*
oUADocument.attachEvent('on' + "mouseover", function(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent);
    // Create an Event
    var oEventMouseOver = new cMouseEvent;
    oEventMouseOver.initMouseEvent("mouseover", true, true, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, oEvent.button, null);
    oEventMouseOver.$pseudoTarget	= oPseudo;
	fNode_dispatchEvent(oTarget, oEventMouseOver);
});

oUADocument.attachEvent('on' + "mouseout", function(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent);
    // Create an Event
    var oEventMouseOut = new cMouseEvent;
    oEventMouseOut.initMouseEvent("mouseout", true, false, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, oEvent.button, null);
    oEventMouseOut.$pseudoTarget	= oPseudo;
	fNode_dispatchEvent(oTarget, oEventMouseOut);
});
*/

function fBrowser_onMouseMove(oEvent) {
    var oTarget		= fBrowser_getEventTarget(oEvent),
    	oPseudo		= fBrowser_getUIEventPseudo(oEvent),
    	nButton 	= fBrowser_getUIEventButton(oEvent),
    	nIndexCommon=-1,
    	aElements	= new cNodeList,
    	oElement,
    	oEventMouseMove = new cMouseEvent,
    	oEventMouseLeave,
		oEventMouseEnter;

	//
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
	}

	// TODO: Remove this dependency from here
	if (!(nDragAndDropManager_dragState || nResizeManager_resizeState)) {
		if (aBrowser_mouseNodes[0] != oTarget) {
			// find common relative
			for (oElement = oTarget; oElement.nodeType != 9 /* cNode.DOCUMENT_NODE */; oElement = oElement.parentNode) {
				aElements.$add(oElement);
				if (nIndexCommon ==-1)
					nIndexCommon = aBrowser_mouseNodes.$indexOf(oElement);
			}

			// TODO: Come up with a better implementation that doesn't check for modality on every iteration in loops

			// propagate mouseleave branch
			for (var nIndex = 0; nIndex < nIndexCommon; nIndex++) {
				oElement	= aBrowser_mouseNodes[nIndex];
				// do not dispatch event if outside modal
				if (!oBrowser_modalNode || fBrowser_isDescendant(oElement, oBrowser_modalNode)) {
				    // Remove :hover pseudo-class
					if (oElement.$hoverable && oElement.$isAccessible())
						fElement_setPseudoClass(oElement, "hover", false);
					//
					oEventMouseLeave = new cMouseEvent;
				    oEventMouseLeave.initMouseEvent("mouseleave", false, false, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, aBrowser_mouseNodes[nIndex + 1] || null);
				    oEventMouseLeave.$pseudoTarget	= oPseudo;
				    fNode_dispatchEvent(oElement, oEventMouseLeave);
				}
			}

			// propagate mouseenter branch
			for (var nIndex	= nIndexCommon + aElements.length - aBrowser_mouseNodes.length; nIndex > 0; nIndex--) {
				oElement	= aElements[nIndex - 1];
				// do not dispatch event if outside modal
				if (!oBrowser_modalNode || fBrowser_isDescendant(oElement, oBrowser_modalNode)) {
				    // Add :hover pseudo-class
					if (oElement.$hoverable && oElement.$isAccessible())
						fElement_setPseudoClass(oElement, "hover", true);
					//
					oEventMouseEnter = new cMouseEvent;
				    oEventMouseEnter.initMouseEvent("mouseenter", false, false, window, null, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, aElements[nIndex] || null);
				    oEventMouseEnter.$pseudoTarget	= oPseudo;
				    fNode_dispatchEvent(oElement, oEventMouseEnter);
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
    fNode_dispatchEvent(oTarget, oEventMouseMove);

	//
	return fBrowser_eventPreventDefault(oEvent, oEventMouseMove);
};

function fBrowser_onContextMenu(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		bPrevent	= false,
		oEventContextMenu	= new cMouseEvent;

	// if modal, do not dispatch event
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
		bPrevent	= true;
	}

    // Init ContextMenu event
    oEventContextMenu.initMouseEvent("contextmenu", true, true, window, 0, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, 2, null);
    oEventContextMenu.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
    if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode)) {

		fNode_dispatchEvent(oTarget, oEventContextMenu);

		// Simulate missing mouseup event in WebKit
		if (bWebKit) {
			var oEventMouseUp	= new cMouseEvent;
			// Init MouseUp event
			oEventMouseUp.initMouseEvent("mouseup", true, true, window, oEvent.detail || 1, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, null, 2, null);
			oEventMouseUp.$pseudoTarget	= oPseudo;
			//
			fNode_dispatchEvent(oTarget, oEventMouseUp);
		}
    }
    else
    	bPrevent	= true;

	if (bPrevent)
		oEventContextMenu.preventDefault();

	//
	return fBrowser_eventPreventDefault(oEvent, oEventContextMenu);
};

function fBrowser_onClick(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		nButton		= fBrowser_getUIEventButton(oEvent),
		bPrevent	= false,
		oEventClick	= new cMouseEvent;

	if (bGecko && oEvent.button == 2)
		return;

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
    	fNode_dispatchEvent(oTarget, oEventClick);
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
		oEventDblClick = new cMouseEvent,
		oEventClick;

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
		if (bTrident && nVersion < 9) {
	 		// Simulate missing 'click' event in IE
	    	oEventClick = new cMouseEvent;
	    	oEventClick.initMouseEvent("click", true, true, window, 2, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, null, nButton, null);
	    	oEventClick.$pseudoTarget	= oPseudo;
	    	fNode_dispatchEvent(oTarget, oEventClick);
		}

		fNode_dispatchEvent(oTarget, oEventDblClick);
    }
};

function fBrowser_onMouseDown(oEvent) {
	var oTarget		= fBrowser_getEventTarget(oEvent),
		oPseudo		= fBrowser_getUIEventPseudo(oEvent),
		nButton		= fBrowser_getUIEventButton(oEvent),
		bCapture	= false,
		oEventMouseDown = new cMouseEvent;

	// Flag for the dblclick fix in IE9<
	bBrowser_mouseDown	= true;

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
		oAmple.activeElement	= oTarget;
		//
		fNode_dispatchEvent(oTarget, oEventMouseDown);
	}
	else {
		// Notify element on capture
		var oModalEvent	= new cUIEvent;
		oModalEvent.initUIEvent("modal", true, false, window, null);
		oModalEvent.$pseudoTarget	= oPseudo;
		fNode_dispatchEvent(oBrowser_modalNode, oModalEvent);
		//
		oEventMouseDown.preventDefault();
	}

	if (bCapture) {
		// Notify element on modal
		var oCaptureEvent	= new cUIEvent;
		oCaptureEvent.initUIEvent("capture", true, false, window, null);
		oCaptureEvent.$pseudoTarget	= oPseudo;
		fNode_dispatchEvent(oTarget, oCaptureEvent);
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
		oEventMouseDown,
		oEventMouseUp	= new cMouseEvent;

	// change target if some element is set to receive capture
	if (oBrowser_captureNode && !fBrowser_isDescendant(oTarget, oBrowser_captureNode)) {
		oTarget	= oBrowser_captureNode;
		oPseudo	= oTarget.$getContainer();
	}

	// Init MouseUp event
    oEventMouseUp.initMouseEvent("mouseup", true, true, window, !bBrowser_mouseDown ? 2 : oEvent.detail || 1, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, nButton, null);
    oEventMouseUp.$pseudoTarget	= oPseudo;

	// do not dispatch event if outside modal
	if (!oBrowser_modalNode || fBrowser_isDescendant(oTarget, oBrowser_modalNode)) {
		// Simulate missing 'mousedown' event in IE (when in dblclick)
		if ((bTrident && nVersion < 9) && !bBrowser_mouseDown) {
	    	oEventMouseDown = new cMouseEvent;
	    	oEventMouseDown.initMouseEvent("mousedown", true, true, window, 2, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, null, nButton, null);
	    	oEventMouseDown.$pseudoTarget	= oPseudo;
	    	fNode_dispatchEvent(oTarget, oEventMouseDown);
		}

		fNode_dispatchEvent(oTarget, oEventMouseUp);
	}

	// Flag for the dblclick fix in IE9<
	bBrowser_mouseDown	= false;

	//
	return fBrowser_eventPreventDefault(oEvent, oEventMouseUp);
};

function fBrowser_onResize(oEvent) {
    // Create an Event
    var oEventResize = new cUIEvent;
    oEventResize.initUIEvent("resize", true, false, window, null);
    fNode_dispatchEvent(oAmple_document, oEventResize);
};

function fBrowser_onScroll(oEvent) {
    // Create an Event
    var oEventScroll = new cUIEvent;
    oEventScroll.initUIEvent("scroll", true, false, window, null);
    fNode_dispatchEvent(oAmple_document, oEventScroll);
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
		var oStyle	= oBrowser_root.style;
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

function fBrowser_eval(sText) {
	var oElementDOM	= oUADocument.getElementsByTagName("head")[0].appendChild(oUADocument.createElement("script"));
	oElementDOM.type= "text/javascript";
	oElementDOM.text= sText;
	oElementDOM.parentNode.removeChild(oElementDOM);
};

function fBrowser_parseXML(sText) {
	// Bugfix FF4 (remote XUL)
	if (bGecko)
		sText	= sText.replace(new cRegExp(sNS_XUL, 'g'), sNS_XUL + '#');
    //TODO: Parse DocTypes and DTDs properly.
    //HACK START: To make translations work properly by processing DocTypes and entities in DTDs.
    fBrowser_parseDoctypes(sText);
    sText = fBrowser_parseEntities(sText);
    //HACK END
	return new cDOMParser().parseFromString(sText, "text/xml");
};

//HACK START: To make translations work properly by processing DocTypes and entities in DTDs.
function fBrowser_parseEntities(sText) {
    for (var sEntityName in hBrowser_entities) {
		sText	= sText.replace(new cRegExp('&' + sEntityName + ';', 'g'), hBrowser_entities[sEntityName]);        
    }
    return sText;
}

function fBrowser_parseDoctypes(sText) {
    // For each DOCTYPE clause
    var aMatchDocType, oDocTypePattern = /<!DOCTYPE\s+(\S+)(\s+(SYSTEM|PUBLIC))?(\s+"(.+)")?(\s+\[([^\]]+)\])?\s*>/img;

    while (result = oDocTypePattern.exec(sText)) {
        if (result[3] == 'SYSTEM' && result[5]) {
            //External DTD by URL
            var oRequest = fBrowser_load(result[5],'application/xml-dtd');
            fBrowser_parseDTD(oRequest.sText);
        }
        if (result[7])
            fBrowser_parseDTD(result[7]);
    }

};

function fBrowser_parseDTD(sText) {
    // Process entities in DTDs
    var aMatchEntity, oEntityPattern = /<!ENTITY\s+(\S+)\s+("([^"]*)"|'([^']*)')\s*>/img;
    while (aMatchEntity = oEntityPattern.exec(result[7])) {
        hBrowser_entities[aMatchEntity[1]] = aMatchEntity[3];
    }
}
//HACK END

function fBrowser_getResponseDocument(oRequest) {
	var oDocument	= oRequest.responseXML,
		sText		= oRequest.responseText;
	// Try parsing responseText
	if (sText) {
		if (bTrident) {
			if (oDocument && !oDocument.documentElement && oRequest.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/))
				oDocument	= fBrowser_parseXML(sText);
		}
		// Bugfix FF4 (remote XUL)
		if (bGecko)
			oDocument	= fBrowser_parseXML(sText);

		if (bWebKit && !oDocument)
			oDocument	= fBrowser_parseXML(sText);
	}
	// Check if there is no error in document
	if (!oDocument)
		return null;
    if (bTrident && nVersion < 9 && oDocument.parseError != 0)
		return null;
    if (!oDocument.documentElement)
		return null;
    if (oDocument.getElementsByTagName("parsererror").length > 0)
		return null;
	return oDocument;
};

//<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" [
//]>
var sBrowser_entities	= '',
	aEntities		= "nbsp;iexcl;cent;pound;curren;yen;brvbar;sect;uml;copy;ordf;laquo;not;shy;reg;macr;deg;plusmn;sup2;sup3;acute;micro;para;middot;cedil;sup1;ordm;raquo;frac14;frac12;frac34;iquest;Agrave;Aacute;Acirc;Atilde;Auml;Aring;AElig;Ccedil;Egrave;Eacute;Ecirc;Euml;Igrave;Iacute;Icirc;Iuml;ETH;Ntilde;Ograve;Oacute;Ocirc;Otilde;Ouml;times;Oslash;Ugrave;Uacute;Ucirc;Uuml;Yacute;THORN;szlig;agrave;aacute;acirc;atilde;auml;aring;aelig;ccedil;egrave;eacute;ecirc;euml;igrave;iacute;icirc;iuml;eth;ntilde;ograve;oacute;ocirc;otilde;ouml;divide;oslash;ugrave;uacute;ucirc;uuml;yacute;thorn;yuml".split(';');
for (var nIndex = 0, nLength = aEntities.length; nIndex < nLength; nIndex++)
	sBrowser_entities	+= '<!' + "ENTITY" + ' ' + aEntities[nIndex] + ' "&#' +(160 + nIndex)+ ';">';

function fBrowser_createFragment(sXml, sAttributes) {
	return fBrowser_parseXML(//		"<?" + "xml" + ' ' + 'version="1.0"' + "?>" +
				'<!' + "DOCTYPE" + ' ' + "div" + '[' + sBrowser_entities + ']>' +
//->Debug
				'\n' +
//<-Debug
				'<' + "div" + ' ' + (sAttributes || '') + '>' +
//->Debug
				'\n' +
//<-Debug
				sXml +
//->Debug
				'\n' +
//<-Debug
				'</' + "div" + '>');
};

function fBrowser_createStyleSheet(sCSS, sUri, sMedia) {
	// Process Stylesheet
	oBrowser_factory.innerHTML	= "#text" + '<' + "style" + ' ' + "type" + '="' + "text/css" + '"' + (sMedia ? ' ' + "media" + '="' + sMedia + '"' : '') + '>' + fUtilities_translateStyleSheet(sCSS, sUri) + '</' + "style" + '>';
	return oBrowser_factory.childNodes[1];
};

function fBrowser_load(sUri, sAccept) {
	var oRequest	= new cXMLHttpRequest;
	oRequest.open("GET", sUri, false);
	if (sAccept)
		oRequest.setRequestHeader("Accept", sAccept + ',*' + '/' + '*;q=0.1');
	oRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	oRequest.setRequestHeader("X-User-Agent", oDOMConfiguration_values["ample-user-agent"]);
	oRequest.send(null);

	return oRequest;
};

function fBrowser_getComputedStyle(oElementDOM) {
	return oElementDOM.currentStyle || window.getComputedStyle(oElementDOM, null);
};

function fBrowser_getStyle(oElementDOM, sName, oStyle) {
	if (!oStyle)
		oStyle	= fBrowser_getComputedStyle(oElementDOM);
	if (bTrident && nVersion < 9) {
		if (sName == "opacity")
			return cString(cString(oStyle.filter).match(/opacity=([\.0-9]+)/i) ? oElementDOM.filters.item("DXImageTransform.Microsoft.Alpha").opacity / 100 : 1);
		else
		if (sName == "backgroundPosition")
			return oStyle[sName + 'X'] + ' ' + oStyle[sName + 'Y'];
		else
		if (sName == "width" || sName == "height") {
			var sValue	= oStyle[sName];
			if (sValue == "auto") {
				var oClientRect	= oElementDOM.getBoundingClientRect();
				return cString(sName == "width"
						? oClientRect["right"] - oClientRect["left"] +(fParseInt(oStyle.marginLeft) || 0)+(fParseInt(oStyle.marginRight) || 0)
						: oClientRect["bottom"] - oClientRect["top"] +(fParseInt(oStyle.marginTop) || 0)+(fParseInt(oStyle.marginBottom) || 0)
				);
			}
			return sValue;
		}
	}
	if (sName == "margin" || sName == "padding")
		return oStyle[sName + "Left"];
	if (sName == "borderWidth")
		return oStyle["borderLeftWidth"];
	if (sName == "borderColor")
		return oStyle["borderLeftColor"];
	if (sName == "backgroundColor") {
		var sValue	= oStyle[sName];
		if (sValue == "transparent" && oElementDOM.parentNode && oElementDOM.parentNode.nodeType == 1)
			return fBrowser_getStyle(oElementDOM.parentNode, sName);
		return sValue;
	}
	//
	return oStyle[sName];
};

function fBrowser_setStyle(oElementDOM, sName, sValue) {
	var oStyle	= oElementDOM.style;
	if (bTrident && nVersion < 9) {
		if (sName == "opacity") {
			var sFilter	= cString(oElementDOM.currentStyle.filter),
				bFilter	= sFilter.match(/opacity=([\.0-9]+)/i);
			if (sValue != '' && sValue < 1) {
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
	// Add units if ommitted
	if (sName != "opacity" && sValue.match(/^[\.\d]+$/))
		sValue	= sValue + 'px';
	//
	oStyle[sName]	= sValue;
};

function fBrowser_adjustStyleValue(oElementDOM, sName, sValue) {
	if (sName == "opacity")
		return sValue == '' ? '1' : sValue;
	if (sName == "backgroundPosition")
		return(sValue == '0%' + ' ' + '0%' || sValue == "none" || sValue == '')? '0px' + ' ' + '0px' : sValue;
	if (sName == "lineHeight") {
		if (bTrident && nVersion < 9 && sValue == "normal")
			return fBrowser_getStyle(oElementDOM, "fontSize");
		return sValue;
	}
	if (sName.match(/border(.+)Width/))
		return sValue == "medium" ? '3px' : sValue;
	if (sValue.match(/([\d]*\.?[\d]+)%/)) {
		var oStyle	= oElementDOM.style,
			sOldValue	= oStyle[sName];
		oStyle[sName]	= sValue;
		sValue	= fBrowser_getStyle(oElementDOM, sName);
		oStyle[sName]	= sOldValue;
		return sValue;
	}
	if (sName.match(/padding|margin|top|left/) || sName.match(/\w(top|left|bottom|right)/i))
		return sValue == "auto" || sValue == '' ? '0px' : sValue;
	return sValue;
};

//
function fBrowser_processScripts() {
	var oDocument,
    	oParserError,
    	oParserMessage,
		aElements,
		oElement,
		oElementDOM,
		oElementNew,
		oAttribute,
		sAttribute,
		sPrefix,
    	aAttributes,
    	hAttributes,
    	bReferenced;

	function fHashToString(hHash) {
		var aAttributes	= [], sAttribute, sPrefix;
		for (sAttribute in oAmple.prefixes) {
			sPrefix = "xmlns" + (sAttribute == '' ? '' : ':' + sAttribute);
			if (!(sPrefix in hHash) && oAmple.prefixes.hasOwnProperty(sAttribute) && sAttribute != "toString")
				hHash[sPrefix]	= oAmple.prefixes[sAttribute];
		}
		for (sAttribute in hHash)
			if (hHash.hasOwnProperty(sAttribute))
				aAttributes.push(sAttribute + '="' + hHash[sAttribute] + '"');
		return aAttributes.join(' ');
	};

	function fGetTagChildren(oElement) {
		var aHtml	= [];
		for (var nIndex = 0, aElement = oElement.childNodes; nIndex < aElement.length; nIndex++)
			aHtml.push(aElement[nIndex].$getTag());
		return aHtml.join('');
	};

	// Process script tags
    aElements = oUADocument.getElementsByTagName("script");
    for (var nIndex = 0, nSkip = 0, sType, sSrc, sText; aElements.length > nSkip; nIndex++) {
    	// Current Script
		oElementDOM	= aElements[nSkip];
		sType	= oElementDOM.type;
		sText	= oElementDOM.text;
		sSrc	= oElementDOM.src;
		if (sText)
			sText	= sText.replace(/^\s*(<!\[CDATA\[)?\s*/, '').replace(/\s*(\]\]>)\s*$/, '');

		// Skip if differenet mime-type
		if (sType == "application/ample+xml" || sType == "text/ample+xml") {
			if (oElementDOM.parentNode == oBrowser_head) {
//->Debug
				fUtilities_warn(sQUARD_FRAGMENT_POSITION_WRN);
//<-Debug
				nSkip++;
				continue;
			}
			hAttributes	= {};
			bReferenced	= false;

			// retrieve namespaces list (in older than IE6, attributes on script tag are not parsed into collection)
			if (bTrident && (nVersion < 6 || nVersion > 8)) {
				if (aAttributes	= oElementDOM.outerHTML.match(/<script([^\>]+)/i)[1].match(/[^=]+=("[^"]+"|[^\s]+)/gi))
					for (var nAttribute = 0; oAttribute = aAttributes[nAttribute]; nAttribute++)
						if (oAttribute.match(/\s([^=]+)="?([^"]+)"?/i) && (sAttribute = cRegExp.$1) != "type")
                			hAttributes[sAttribute]	= cRegExp.$2;
			}
			else {
		        aAttributes = oElementDOM.attributes;
		        for (var nAttribute = 0; oAttribute = aAttributes[nAttribute]; nAttribute++)
		        	if (oAttribute.specified && (sAttribute = oAttribute.nodeName.toLowerCase()) != "type")
                		hAttributes[sAttribute]	= sAttribute == "style" ? oElementDOM[sAttribute].cssText : fUtilities_encodeEntities(oAttribute.nodeValue);
			}

			if (sSrc) {
				var oRequest	= fBrowser_load(sSrc, "text/xml");
				// loaded fragment
				oDocument	= fBrowser_getResponseDocument(oRequest);
				bReferenced	= true;
			}
			else
				oDocument	= fBrowser_createFragment(
									sText.replace(/^\s*<\?xml.+\?>/, '').replace(/&/g, '&amp;').replace(/<script(.|\n|\r)+$/, ''),
									fHashToString(hAttributes)
								);

			oParserError	= oDocument ? oDocument.getElementsByTagName("parsererror")[0] : null;
		    if (oDocument && oDocument.documentElement && !oParserError) {
		    	// Set xml:base for referenced documents
		    	if (bReferenced)
		    		if (!oDocument.documentElement.getAttribute("xml:base"))
		    			oDocument.documentElement.setAttribute("xml:base", fUtilities_resolveUri(sSrc, fNode_getBaseURI(oAmple_root)));

		    	// import XML DOM into Ample DOM
		    	oElement	= fDocument_importNode(oAmple_document, oDocument.documentElement, true, null, true);
		    	// Remove prefixes declarations (already available from root)
		    	if (!bReferenced) {
		    		for (sAttribute in oAmple.prefixes) {
			    		sPrefix = "xmlns" + (sAttribute == '' ? '' : ':' + sAttribute);
		    			if (sPrefix in hAttributes && hAttributes[sPrefix] == oAmple.prefixes[sAttribute])
		    				delete oElement.attributes[sPrefix];
		    		}
/*
		    		// Change root element name to script
		    		oElement.nodeName	=
		    		oElement.localName	=
		    		oElement.tagName	= "script";
*/
		    	}
		    	// render Ample DOM
		    	if (bTrident) {
		    		oElementNew	= oUADocument.createElement("div");
		    		fBrowser_replaceNode(oElementDOM, oElementNew);
			    	oElementNew.innerHTML = bReferenced ? oElement.$getTag() : fGetTagChildren(oElement);

					// Map attributes
					if (oElementDOM.style.cssText)
						oElementNew.style.cssText	= oElementDOM.style.cssText;
					if (oElementDOM.className)
						oElementNew.className = oElementDOM.className;
					// duplicate id problem
					if (!bReferenced)
						oElementNew.setAttribute('id', oElementDOM.getAttribute('id') || oElement.uniqueID);
		    	}
		    	else {
		    		for (sAttribute in hAttributes)
		    			if (hAttributes.hasOwnProperty(sAttribute) && (sAttribute.substr(0, 2) == 'on' || sAttribute == "src"))
		    				delete hAttributes[sAttribute];
					// duplicate id problem
		    		if (!bReferenced && !hAttributes['id'])
		    			hAttributes['id']	= oElement.uniqueID;

		    		oElementNew	= oUADocument.importNode(
		    							fBrowser_createFragment(
		    									bReferenced ? oElement.$getTag() : fGetTagChildren(oElement),
		    									fHashToString(hAttributes)
		    								).documentElement,
		    							true);
		    		oElementDOM.parentNode.replaceChild(oElementNew, oElementDOM);
		    	}

				//
		    	fNode_appendChild(oAmple_root, oElement);

				// Register tree
				fDocument_register(oAmple_document, oElement);
		    }
		    else {
				oElementNew	= oUADocument.createElement("pre");
				fBrowser_replaceNode(oElementDOM, oElementNew);
		    	oElementNew.innerHTML	= "script" + ' ' + "parsererror";
//->Debug
				// First "standard" errors output
			    if (oParserError) {
			    	// Gecko/Presto
					if (oParserMessage = oParserError.getElementsByTagName('sourcetext')[0])
						oElementNew.textContent	= oParserError.firstChild.textContent + '\n' +
															oParserMessage.textContent;
					else
					// Webkit
					if (oParserMessage = oParserError.getElementsByTagName("div")[0])
						oElementNew.textContent	= 'XML Parsing Error: ' + oParserMessage.textContent.replace(/.+:/, '') +
													'Location: ' + oUALocation + '\n' +
													 oParserMessage.textContent.replace(/:.+/, '');
			    }
			    else
			    // Trident
			    if (oDocument && oDocument.parseError) {
					oElementNew.innerText	= 'XML Parsing Error: ' + oDocument.parseError.reason + '\n' +
													'Location: ' + (oDocument.parseError.url || oUALocation) + '\n' +
													'Line Number: ' + oDocument.parseError.line + ', Column ' + oDocument.parseError.linepos + ':\n'+
													oDocument.parseError.srcText + '\n' +
													new cArray(oDocument.parseError.linepos).join('-') + '^';
			    }
                //Unknown failure on our part (No Document or Document ParserError).
                else {
					oElementNew.innerText	= 'XML Parsing Error: ' + 'Unknown failure to parse.  This should not happen.  It means that the browser did not return a parsing error we understand.' + '\n' +
													'Location: ' + (oUALocation) + '\n';
                    oElementNew.innerText	+= 'Document ' + (oDocument?'exists':'does not exist'); 
                }
//<-Debug

//->Debug
			    fUtilities_warn(sGUARD_XML_SYNTAX_WRN);
//<-Debug
		    }
		}
		else
		if (sType == "application/ample+javascript" || sType == "text/ample+javascript") {
			if (sSrc)
				oRequest	= fBrowser_load(sSrc, "text/javascript");

			// Try executing
			try {
				fBrowser_eval(oRequest.responseText);
			} catch (oException) {
//->Debug
				fUtilities_warn(sGUARD_JAVASCRIPT_SYNTAX_WRN, [oException.message]);
//<-Debug
			}
			//
			oElementDOM.parentNode.removeChild(oElementDOM);
		}
		else
			nSkip++;
    }
};

function fBrowser_processStyleSheets() {
	var aElements,
		oElement;

	// Process inline StyleSheets
    aElements   = oUADocument.getElementsByTagName("style");
    for (var nIndex = 0, nLength = aElements.length; nIndex < nLength; nIndex++) {
    	oElement	= aElements[nIndex];

    	if (oElement.type == "text/ample+css")
    		fBrowser_replaceNode(oElement, fBrowser_createStyleSheet(oElement.innerHTML, oUALocation.href, oElement.getAttribute("media")));
	}

	// Process external StyleSheets
    aElements   = oUADocument.getElementsByTagName("link");
    for (var nIndex = 0, nSkip = 0; aElements.length > nSkip; nIndex++) {
    	oElement	= aElements[nSkip];

		// Skip if different mime-type
		if (oElement.type != "text/ample+css")
			nSkip++;
		else
			fBrowser_replaceNode(oElement, fBrowser_createStyleSheet(fBrowser_load(oElement.href, "text/css").responseText, oElement.href, oElement.getAttribute("media")));
    }
};

//
fBrowser_attachEvent(window, "load", function(oEvent) {
	//
	oBrowser_body	= oUADocument.body;
	oBrowser_head	= oUADocument.getElementsByTagName("head")[0];

	// change readystate to "loaded"
	fAmple_changeReadyState("loaded");

//->Source
	oUADocument.title	= "Initializing...";
//<-Source

    // Add to document, otherwise will not render VML
	oBrowser_body.appendChild(oBrowser_factory);
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
		fBrowser_attachEvent(oBrowser_body, "mousewheel",	fBrowser_onMouseWheel);
		if (bTrident)
			fBrowser_attachEvent(oUADocument, "selectstart",	fBrowser_onSelectStart);
	}
	else
		fBrowser_attachEvent(oBrowser_body, "DOMMouseScroll",	fBrowser_onMouseWheel);

	// Register touch events
	fBrowser_attachEvent(oUADocument, "touchstart",		fBrowser_onTouch);
	fBrowser_attachEvent(oUADocument, "touchmove",		fBrowser_onTouch);
	fBrowser_attachEvent(oUADocument, "touchend",		fBrowser_onTouch);
	fBrowser_attachEvent(oUADocument, "touchcancel",	fBrowser_onTouch);
	fBrowser_attachEvent(oUADocument, "gesturestart",	fBrowser_onGesture);
	fBrowser_attachEvent(oUADocument, "gesturechange",	fBrowser_onGesture);
	fBrowser_attachEvent(oUADocument, "gestureend",		fBrowser_onGesture);

	// Register clipboard events
	fBrowser_attachEvent(oUADocument, "copy",			fBrowser_onClipboard);
	fBrowser_attachEvent(oUADocument, "beforecopy",		fBrowser_onClipboard);
	fBrowser_attachEvent(oUADocument, "cut",			fBrowser_onClipboard);
	fBrowser_attachEvent(oUADocument, "beforecut",		fBrowser_onClipboard);
	fBrowser_attachEvent(oUADocument, "paste",			fBrowser_onClipboard);
	fBrowser_attachEvent(oUADocument, "beforepaste",	fBrowser_onClipboard);

	// Initialize
	// When running in Air, start in sync with onload
	if (bWebKit && window.runtime)
		fAmple_initialize();
	else
		fSetTimeout(fAmple_initialize, 0);
});

fBrowser_attachEvent(window, "unload", function(oEvent) {
//->Source
	oUADocument.title	= "Finalizing...";
//<-Source

    // Remove factory from document
	oBrowser_body.removeChild(oBrowser_factory);

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
		fBrowser_detachEvent(oBrowser_body, "mousewheel",	fBrowser_onMouseWheel);
		if (bTrident)
			fBrowser_detachEvent(oUADocument, "selectstart",	fBrowser_onSelectStart);
	}
	else
		fBrowser_detachEvent(oBrowser_body, "DOMMouseScroll",	fBrowser_onMouseWheel);

	// Unregister touch events
	fBrowser_detachEvent(oUADocument, "touchstart",		fBrowser_onTouch);
	fBrowser_detachEvent(oUADocument, "touchmove",		fBrowser_onTouch);
	fBrowser_detachEvent(oUADocument, "touchend",		fBrowser_onTouch);
	fBrowser_detachEvent(oUADocument, "touchcancel",	fBrowser_onTouch);
	fBrowser_detachEvent(oUADocument, "gesturestart",	fBrowser_onGesture);
	fBrowser_detachEvent(oUADocument, "gesturechange",	fBrowser_onGesture);
	fBrowser_detachEvent(oUADocument, "gestureend",		fBrowser_onGesture);

	// Unregister clipboard events
	fBrowser_detachEvent(oUADocument, "copy",			fBrowser_onClipboard);
	fBrowser_detachEvent(oUADocument, "beforecopy",		fBrowser_onClipboard);
	fBrowser_detachEvent(oUADocument, "cut",			fBrowser_onClipboard);
	fBrowser_detachEvent(oUADocument, "beforecut",		fBrowser_onClipboard);
	fBrowser_detachEvent(oUADocument, "paste",			fBrowser_onClipboard);
	fBrowser_detachEvent(oUADocument, "beforepaste",	fBrowser_onClipboard);

	// Unregister window event listeners
	fBrowser_detachEvent(window, "resize", fBrowser_onResize);
	fBrowser_detachEvent(window, "scroll", fBrowser_onScroll);

	// Finalize
	fAmple_finalize();
});

function fAmple_changeReadyState(sValue) {
	//
	oAmple.readyState	= sValue;

	// Dispatch
	var oReadyStateChangeEvent	= new cEvent;
	oReadyStateChangeEvent.initEvent("readystatechange", false, false);
	fNode_dispatchEvent(oAmple_document, oReadyStateChangeEvent);
};

function fAmple_initialize() {
//->Source
	oUADocument.title	= "Processing...";
//<-Source

//->Source
    var oDateCSS	= new cDate;
//<-Source

	// Process CSS stylesheets
	fBrowser_processStyleSheets();

//->Source
    var oDateXML	= new cDate;
//<-Source

	// Process XML markup
	fBrowser_processScripts();

	// change readystate to "interactive"
	fAmple_changeReadyState("interactive");

	// Set documentElement style pointer object
    if (oDOMConfiguration_values["ample-enable-style"])
    	oAmple_root.style	= oBrowser_body.style;

	// IE background images cache fix
	try {
		if (bTrident && nVersion < 7)
			oUADocument.execCommand("BackgroundImageCache", false, true);
	} catch (oException){};

    // Fire Event
    var oEventLoad = new cEvent;
    oEventLoad.initEvent("load", false, false);
    fNode_dispatchEvent(oAmple_document, oEventLoad);

	// change readystate to "complete"
	fAmple_changeReadyState("complete");

//->Source
	var nElements	= fElement_getElementsByTagName(oAmple_document, '*').length,
		nAnonymous	= (function(){var nLength = 0; for (var sKey in oDocument_all) if (oDocument_all.hasOwnProperty(sKey)) nLength++; return nLength})();
	oUADocument.title	=	"Ample: " + nElements + " (+" + (nAnonymous - nElements) + " anonymous). " +
							"DHTML: " + oUADocument.getElementsByTagName('*').length + ". " +
							"CSS time: " + (oDateXML - oDateCSS) + " ms. " +
							"XML time: " + (new cDate - oDateXML) + " ms. ";
//<-Source
};

function fAmple_finalize() {
	var aElements = oAmple_root.childNodes,
		oEventUnload;
	for (var nIndex = 0; nIndex < aElements.length; nIndex++) {
	    // fire unload event on fragments
		oEventUnload = new cEvent;
	    oEventUnload.initEvent("unload", false, false);
	    fNode_dispatchEvent(aElements[nIndex], oEventUnload);
	}

    // fire unload event on document
    oEventUnload = new cEvent;
    oEventUnload.initEvent("unload", false, false);
    fNode_dispatchEvent(oAmple_document, oEventUnload);

	// free memory
    fDocument_unregister(oAmple_document, oAmple_root);
};
