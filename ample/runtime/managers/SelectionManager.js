/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fSelectionManager_onMouseDown(oEvent) {
	for (var oElement = oEvent.target, bAllow = false; oElement.nodeType != 9 /* cNode.DOCUMENT_NODE */; oElement = oElement.parentNode)
		if (oElement.$selectable == true)
			bAllow	= true;
		else
		if (oElement.$selectable == false)
			return !bAllow && oEvent.preventDefault();
};

// Attaching to implementation
// Public Properties
cElement.prototype.$selectable	= null;

// Registering Event Handlers
fEventTarget_addEventListener(oAmple_document, "mousedown",	fSelectionManager_onMouseDown, false);
