/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_ellipse	= function(){};
cSVGElement_ellipse.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
	cSVGElement_ellipse.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer(),
					oStyle		= oElement.style;
				switch (oEvent.attrName) {
					case "cx":
					case "cy":
					case "rx":
					case "ry":
						oElement.path	= cSVGElement_ellipse.toPath(this);
						break;
					//
					case "transform":
						cSVGElement.applyTransform(this);
						break;
					//
					default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

			// Apply gradients
			if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

			// Apply transform
			cSVGElement.applyTransform(this);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_ellipse.toPath	= function(oElement) {
		var nCx	= oElement.getAttribute("cx") * 1,
			nCy	= oElement.getAttribute("cy") * 1,
			nRx	= oElement.getAttribute("rx") * 1,
			nRy	= oElement.getAttribute("ry") * 1;
		return "at" + [nCx - nRx, nCy - nRy, nCx + nRx, nCy + nRy, nCx - nRx, nCy - nRy, nCx - nRx, nCy - nRy].map(Math.round) + "x";
	};

	// presentation
	cSVGElement_ellipse.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-ellipse' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" \
			style="position:absolute;top:0;left:0;height:100%;width:100%;"\
			path="' + cSVGElement_ellipse.toPath(this) + '"\
		>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_ellipse.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element with language
oSVGNamespace.setElement("ellipse", cSVGElement_ellipse);
