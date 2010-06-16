/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_linearGradient	= function(){};
cSVGElement_linearGradient.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_linearGradient.handlers	= {
		"DOMAttrModified":	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "x1":
					case "x2":
					case "y1":
					case "y2":
						var sId	= this.getAttribute("id");
						if (sId) {
							var aElements	= this.ownerDocument.querySelectorAll("[fill=url(#" + sId + ")]");
							for (var nIndex = 0; nIndex < aElements.length; nIndex++)
								cSVGElement.setStyle(aElements[nIndex], "fill", "url(#" + sId + ")");
						}
				}
			}
		}
	};
};

// Register Element with language
oSVGNamespace.setElement("linearGradient", cSVGElement_linearGradient);
