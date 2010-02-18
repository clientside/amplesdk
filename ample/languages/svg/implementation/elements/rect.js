/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_rect	= function(){};
cSVGElement_rect.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
	cSVGElement_rect.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "width":
					case "height":
					case "x":
					case "y":
					case "rx":
					case "ry":
						oElement.path	= cSVGElement_rect.toPath(this);
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

			// Apply transformations
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_rect.toPath	= function(oElement) {
		var nX	= oElement.getAttribute("x") * 1,
			nY	= oElement.getAttribute("y") * 1,
			nWidth	= oElement.getAttribute("width") * 1,
			nHeight	= oElement.getAttribute("height") * 1,
			nRx	= oElement.getAttribute("rx") * 1,
			nRy	= oElement.getAttribute("ry") * 1;
		return "m" + [nX, nY].map(Math.round) +
				" r" + [nWidth, 0].map(Math.round) +
				" r" + [0, nHeight].map(Math.round) +
				" r" + [-nWidth, 0].map(Math.round) +
				" r" + [0, -nHeight].map(Math.round) + "e";
	};

	// presentation
	cSVGElement_rect.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-rect' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" \
					style="position:absolute;top:0;left:0;height:100%;width:100%;"\
					path="' + cSVGElement_rect.toPath(this) + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_rect.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element with language
oSVGNamespace.setElement("rect", cSVGElement_rect);
