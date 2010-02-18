/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_use	= function(){};
cSVGElement_use.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_use.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sHref	= this.getAttribute("xlink:href"),
				that	= this;
			if (sHref) {
				setTimeout(function() {
					var oRef	= that.ownerDocument.getElementById(sHref.substr(1)),
						sValue;
					if (oRef) {
						// Create a clone of referenced element
						var oNode	= oRef.cloneNode(true);
						oNode.removeAttribute("id");
						that.parentNode.insertBefore(oNode, that);

						// Apply transformations
						if (sValue = that.getAttribute("transform"))
							cSVGElement.setTransform(oNode, sValue);

						// Apply CSS
						cSVGElement.applyCSS(oNode);
					}
				});
			}
		}
	};

	// presentation
	cSVGElement_use.prototype.$getTag	= function() {
		return '';
	};
};

// Register Element with language
oSVGNamespace.setElement("use", cSVGElement_use);
