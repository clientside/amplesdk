/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_use	= function(){};
cSVGElement_use.prototype	= new cSVGElement("use");

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_use.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sHref	= this.getAttribute("xlink:href"),
				that	= this;
			if (sHref) {
//				setTimeout(function() {
					var oRef	= that.ownerDocument.getElementById(sHref.substr(1));
					if (oRef) {
						// Create a clone of referenced element
						var oNode	= oRef.cloneNode(true);
						oNode.removeAttribute("id");

						// Copy attributes from "use" element to the clone
						for (var sAttribute in this.attributes)
							if (this.attributes.hasOwnProperty(sAttribute) && sAttribute != "id" && sAttribute != "xlink:href")
								oNode.attributes[sAttribute]	= this.attributes[sAttribute];

						that.parentNode.insertBefore(oNode, that);
					}
//				});
			}
		}
	};

	// presentation
	cSVGElement_use.prototype.$getTag	= function() {
		return '';
	};
};

// Register Element
ample.extend(cSVGElement_use);
