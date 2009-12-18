/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fAMLSelection_onMouseDown(oEvent) {
	for (var oElement = oEvent.target, bAllow = false; oElement.nodeType != cAMLNode.DOCUMENT_NODE; oElement = oElement.parentNode)
		if (oElement.$selectable == true)
			bAllow	= true;
		else
		if (oElement.$selectable == false)
			return !bAllow && oEvent.preventDefault();
};

cAMLElement.prototype.$selectable	= null;

ample.addEventListener("mousedown", fAMLSelection_onMouseDown, false);
