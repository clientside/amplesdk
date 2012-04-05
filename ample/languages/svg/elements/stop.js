/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_stop	= function(){};
cSVGElement_stop.prototype	= new cSVGElement("stop");

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_stop.prototype.$mapAttribute	= function(sName, sValue) {
		if (sName == "offset" || sName == "stop-color" || sName == "stop-opacity") {
			var sId	= this.parentNode.getAttribute("id");
			if (sId) {
				var aElements	= this.ownerDocument.querySelectorAll("[fill=url(#" + sId + ")]");
				for (var nIndex = 0; nIndex < aElements.length; nIndex++)
					aElements[nIndex].$setStyle("fill", "url(#" + sId + ")");
			}
		}
	};
};

// Register Element
ample.extend(cSVGElement_stop);
