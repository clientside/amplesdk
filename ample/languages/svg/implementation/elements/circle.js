/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_circle	= function(){};
cSVGElement_circle.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
	cSVGElement_circle.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer(),
					oStyle		= oElement.style;
				switch (oEvent.attrName) {
					case "cx":
					case "cy":
					case "r":
						oElement.path	= cSVGElement_circle.toPath(this);
						break;
					//
					case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_circle.toPath	= function(oElement) {
		var nCx	= oElement.getAttribute("cx") * 1,
			nCy	= oElement.getAttribute("cy") * 1,
			nR	= oElement.getAttribute("r") * 1;
		return "at" + [nCx - nR, nCy - nR, nCx + nR, nCy + nR, nCx - nR, nCy - nR, nCx - nR, nCy - nR].map(Math.round) + "x";
	};

	// presentation
	cSVGElement_circle.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-circle' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" \
			style="position:absolute;top:0;left:0;height:100%;width:100%;"\
			path="' + cSVGElement_circle.toPath(this) + '"\
		>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_circle.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element with language
oSVGNamespace.setElement("circle", cSVGElement_circle);
