/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_linearGradient	= function(){};
cSVGElement_linearGradient.prototype	= new cSVGElement("linearGradient");

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_linearGradient.prototype.$mapAttribute	= function(sName, sValue) {
		if (sName == "x1" || sName == "y1" || sName == "x2" || sName == "y2") {
			var sId	= this.getAttribute("id");
			if (sId) {
				var aElements	= this.ownerDocument.querySelectorAll("[fill=url(#" + sId + ")]");
				for (var nIndex = 0; nIndex < aElements.length; nIndex++)
					aElements[nIndex].$setStyle("fill", "url(#" + sId + ")");
			}
		}
	};
};

// Register Element
ample.extend(cSVGElement_linearGradient);
