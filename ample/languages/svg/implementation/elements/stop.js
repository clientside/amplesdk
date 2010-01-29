/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_stop	= function(){};
cSVGElement_stop.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_stop.handlers	= {
		"DOMAttrModified":	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "offset":
					case "stop-color":
					case "stop-opacity":
						var sId	= this.parentNode.getAttribute("id");
						if (sId) {
							var aElements	= this.ownerDocument.querySelectorAll("[fill=url(#" + sId + ")]");
							for (var nIndex = 0; nIndex < aElements.length; nIndex++)
								cSVGElement.setStyle(aElements[nIndex], "fill", "url(#" + sId + ")");
						}
				}
			}
		}
	};
}

// Register Element with language
oSVGNamespace.setElement("stop", cSVGElement_stop);
