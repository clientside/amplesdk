/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Properties
var oAMLFocus_focusGroup	= null;

//
function fAMLFocus_focus(oElement) {
	if (oElement != oAMLFocus_focusGroup) {
		// Blur old element
		if (oAMLFocus_focusGroup)
			fAMLFocus_blur(oAMLFocus_focusGroup);

		// Focus element
		if (oAMLDocument_all[oElement.uniqueID]) {
			// Set active element
			oAMLFocus_focusGroup	= oElement;

			// Set document active element
			oAmple.activeElement	= oElement;

			// Add :focus pseudo-class
			fAMLElement_setPseudoClass(oElement, "focus", true);

			var oEvent	= new cAMLUIEvent;
			oEvent.initUIEvent("focus", false, false, window, null);
			fAMLNode_dispatchEvent(oElement, oEvent);

			var oEvent	= new cAMLUIEvent;
			oEvent.initUIEvent("DOMFocusIn", true, false, window, null);
			fAMLNode_dispatchEvent(oElement, oEvent);
		}
	}
};

function fAMLFocus_blur(oElement) {
	if (oElement == oAMLFocus_focusGroup) {
		// Blur element
		if (oAMLDocument_all[oElement.uniqueID]) {
			// Unset active element
			oAMLFocus_focusGroup	= null;

			// Unset document active element
			oAmple.activeElement	= oBrowser_modalNode || oAmple_document.documentElement;

			// Remove :focus pseudo-class
			fAMLElement_setPseudoClass(oElement, "focus", false);

			// If element has not been removed from DOM
			var oEvent	= new cAMLUIEvent;
			oEvent.initUIEvent("blur", false, false, window, null);
			fAMLNode_dispatchEvent(oElement, oEvent);

			var oEvent	= new cAMLUIEvent;
			oEvent.initUIEvent("DOMFocusOut", true, false, window, null);
			fAMLNode_dispatchEvent(oElement, oEvent);
		}
	}
};

/* Focus Group */
function fAMLFocus_getFocusGroupNext(oElement, nTabIndex) {
	for (var oParent = oElement, oFocusGroup/*, aChildren*/; oParent; oParent = oParent.parentNode) {
		if (oParent == oElement) {
			if (oParent.firstChild && (oFocusGroup = fAMLFocus_getFocusGroupNextChild(oParent.firstChild, nTabIndex)))
				return oFocusGroup;
			if (oParent.contentFragment && (oFocusGroup = fAMLFocus_getFocusGroupNextChild(oParent.contentFragment.firstChild, nTabIndex)))
				return oFocusGroup;
//			if ((aChildren = oParent.$childNodesAnonymous) && aChildren.length &&(oFocusGroup = fAMLFocus_getFocusGroupNextChild(aChildren[0], nTabIndex, true)))
//				return oFocusGroup;
		}
		if (oParent == oBrowser_modalNode)
			break;
		if (oParent.nextSibling && (oFocusGroup = fAMLFocus_getFocusGroupNextChild(oParent.nextSibling, nTabIndex)))
			return oFocusGroup;
	}
};

function fAMLFocus_getFocusGroupNextChild(oElement, nTabIndex, bDeep) {
	for (var oSibling = oElement, oFocusGroup/*, aChildren*/; oSibling; oSibling = oSibling.nextSibling) {
		if (fAMLFocus_isTabStop(oSibling, nTabIndex, bDeep))
			return oSibling;
		else
		if (oSibling.contentFragment && (oFocusGroup = fAMLFocus_getFocusGroupNextChild(oSibling.contentFragment.firstChild, nTabIndex)))
			return oFocusGroup;
		else
		if (oSibling.firstChild && (oFocusGroup = fAMLFocus_getFocusGroupNextChild(oSibling.firstChild, nTabIndex)))
			return oFocusGroup;
//		else
		/* Walk into the anonymous tree */
//		if ((aChildren = oSibling.$childNodesAnonymous) && aChildren.length &&(oFocusGroup = fAMLFocus_getFocusGroupNextChild(aChildren[0], nTabIndex, true)))
//			return oFocusGroup;
	}
};

function fAMLFocus_getFocusGroupPrevious(oElement, nTabIndex) {
	for (var oParent = oElement, oFocusGroup/*, aChildren*/; oParent; oParent = oParent.parentNode) {
		if (oParent != oElement) {
			if (fAMLFocus_isTabStop(oParent, nTabIndex))
				return oParent;
//			if (oParent.contentFragment &&(oFocusGroup = fAMLFocus_getFocusGroupPreviousChild(oParent.contentFragment.lastChild, nTabIndex)))
//				return oFocusGroup;
//			if ((aChildren = oParent.$childNodesAnonymous) && aChildren.length &&(oFocusGroup = fAMLFocus_getFocusGroupPreviousChild(aChildren[aChildren.length - 1], nTabIndex, true)))
//				return oFocusGroup;
		}
		if (oParent == oBrowser_modalNode)
			break;
		if (oParent.previousSibling && (oFocusGroup = fAMLFocus_getFocusGroupPreviousChild(oParent.previousSibling, nTabIndex)))
			return oFocusGroup;
	}
};

function fAMLFocus_getFocusGroupPreviousChild(oElement, nTabIndex, bDeep) {
	for (var oSibling = oElement, oFocusGroup/*, aChildren*/; oSibling; oSibling = oSibling.previousSibling)
		/* Walk into the anonymous tree */
//		if ((aChildren = oSibling.$childNodesAnonymous) && aChildren.length &&(oFocusGroup = fAMLFocus_getFocusGroupPreviousChild(aChildren[aChildren.length-1], nTabIndex, true)))
//			return oFocusGroup;
//		else
		if (oSibling.contentFragment &&(oFocusGroup = fAMLFocus_getFocusGroupPreviousChild(oSibling.contentFragment.lastChild, nTabIndex)))
			return oFocusGroup;
		else
		if (oSibling.lastChild && (oFocusGroup = fAMLFocus_getFocusGroupPreviousChild(oSibling.lastChild, nTabIndex)))
			return oFocusGroup;
		else
		if (fAMLFocus_isTabStop(oSibling, nTabIndex, bDeep))
			return oSibling;
};

function fAMLFocus_isTabStop(oElement, nTabIndex, bDeep) {
	return oElement.tabIndex >-1 && (bDeep || oElement.tabIndex == nTabIndex) && oElement.$isAccessible() && fAMLFocus_isVisible(oElement);
};

function fAMLFocus_isVisible(oElement) {
	// Algorythm 2 (faster but ignores visibility:hidden and will fail if this style was used)
	for (var oElementDOM; oElement.nodeType != cAMLNode.DOCUMENT_NODE; oElement = oElement.parentNode)
		if (oElementDOM = oElement.$getContainer())
			return oElementDOM.offsetHeight > 0;

	// Algorythm 1
//	for (var oElementDOM = oElement.$getContainer(); oElementDOM.nodeType != cAMLNode.DOCUMENT_NODE; oElementDOM = oElementDOM.parentNode)
//		if (fBrowser_getComputedStyle(oElementDOM).display == "none")
//			return false;
	return true;
};

function fAMLFocus_onMouseDown(oEvent) {
	// Check if default action is prevented
	if (oEvent.defaultPrevented)
		return;

	// Find new element to focus
	var oFocusGroup	= null;
    for (var oElement = oEvent.target; oElement.nodeType != cAMLNode.DOCUMENT_NODE && !oFocusGroup; oElement = oElement.parentNode)
    	if (fAMLFocus_isTabStop(oElement, 0, true))
    		oFocusGroup = oElement;

	//
    if (oFocusGroup)
    	fAMLFocus_focus(oFocusGroup);
    else
    if (oAMLFocus_focusGroup)
		fAMLFocus_blur(oAMLFocus_focusGroup);
};

function fAMLFocus_onKeyDown(oEvent) {
	// Check if default action is prevented
	if (oEvent.defaultPrevented)
		return;

	// Prevent system tab combinations handling
	if (oEvent.keyIdentifier == "Tab" && (oEvent.altKey || oEvent.ctrlKey))
		return;

	if (oEvent.keyIdentifier == "Tab") {
		var oFocusGroup	= null,
			nTabIndexCurrent	= 0;

		// If there are items with the same tabIndex value
		if (oAMLFocus_focusGroup) {
			nTabIndexCurrent	= oAMLFocus_focusGroup.tabIndex;
			if (oEvent.shiftKey)
				oFocusGroup	= fAMLFocus_getFocusGroupPrevious(oAMLFocus_focusGroup, nTabIndexCurrent);
			else
				oFocusGroup	= fAMLFocus_getFocusGroupNext(oAMLFocus_focusGroup, nTabIndexCurrent);
		}

		// Otherwise
		if (!oFocusGroup) {
			var oRoot	= oBrowser_modalNode || this.documentElement,
				nTabIndexMax	=-nInfinity,
				nTabIndexMin	= nInfinity,
				nTabIndexNext	= nTabIndexMin,
				nTabIndexPrev	= nTabIndexMax;

			for (var nIndex = 0, nTabIndex, oElement, aElements = fAMLElement_getElementsByTagName(oRoot, '*'); oElement = aElements[nIndex]; nIndex++) {
				nTabIndex	= oElement.tabIndex;
				if (nTabIndex >-1) {
					if (nTabIndex > nTabIndexMax)
						nTabIndexMax	= nTabIndex;
					if (nTabIndex < nTabIndexMin)
						nTabIndexMin	= nTabIndex;
					if (nTabIndex < nTabIndexCurrent && nTabIndex > nTabIndexPrev)
						nTabIndexPrev	= nTabIndex;
					if (nTabIndex > nTabIndexCurrent && nTabIndex < nTabIndexNext)
						nTabIndexNext	= nTabIndex;
				}
			}
			if (nTabIndexNext == nInfinity)
				nTabIndexNext	= 0;
			if (nTabIndexPrev ==-nInfinity)
				nTabIndexPrev	= 0;
			//
			if (oEvent.shiftKey)
				oFocusGroup	= fAMLFocus_getFocusGroupPreviousChild(oRoot, nTabIndexPrev) || fAMLFocus_getFocusGroupPreviousChild(oRoot, nTabIndexMax);
			else
				oFocusGroup	= fAMLFocus_getFocusGroupNextChild(oRoot, nTabIndexNext) ||fAMLFocus_getFocusGroupNextChild(oRoot, nTabIndexMin);
		}

		// Use setTimeout to fix tabbed navigation in Opera)
/*	setTimeout(function() {  */
		// Focus new element
		if (oFocusGroup)
			fAMLFocus_focus(oFocusGroup);
/*	}, 0);	*/
		// Prevents browser-based focus manager
		oEvent.preventDefault();
	}
};

// Attaching to implementation
cAMLElement.prototype.tabIndex	=-1;

cAMLElement.prototype.focus	= function() {
	fAMLFocus_focus(this);
};

cAMLElement.prototype.blur	= function() {
	fAMLFocus_blur(this);
};

cAMLElement.prototype.$isAccessible	= function() {
	return true;
};

// Registering Event Handlers
fAMLEventTarget_addEventListener(oAmple_document,	"mousedown",	fAMLFocus_onMouseDown,	false);
fAMLEventTarget_addEventListener(oAmple_document,	"keydown",		fAMLFocus_onKeyDown,	false);
