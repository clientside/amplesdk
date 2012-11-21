/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

oAmple.modal		= function(oNode) {
//->Guard
	fGuard(arguments, [
		["element",	cElement, true, true]
	]);
//<-Guard

	if (oNode == null) {
		oBrowser_modalNode	= oAmple.activeElement	= null;
	}
	else {
		// Propagate mouseleave
		for (var nIndex = 0, oElement, oEvent, oElementDOM; nIndex < aBrowser_mouseNodes.length - 1; nIndex++) {
			oElement	= aBrowser_mouseNodes[nIndex];
			oElementDOM	= oElement.$getContainer();
			// Remove :hover pseudo-class
			if ((oDOMConfiguration_values["ample-enable-css-hover"] || oElement.$hoverable) && oElementDOM && oElement.$isAccessible())
				fElement_setPseudoClass(oElement, "hover", false);
			//
			oEvent	= new cMouseEvent;
			oEvent.initMouseEvent("mouseleave", false, false, window, null, 0, 0, 0, 0, false, false, false, false, 0, aBrowser_mouseNodes[nIndex + 1] || null);
			oEvent.$pseudoTarget	= oElementDOM;
			fEventTarget_dispatchEvent(oElement, oEvent);
		}
		aBrowser_mouseNodes	= new cNodeList;
		//
		oBrowser_modalNode	= oAmple.activeElement	= oNode;
	}
};
