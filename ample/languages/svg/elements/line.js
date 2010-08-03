/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_line	= function(){};
cSVGElement_line.prototype	= new cSVGElement("line");

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
	cSVGElement_line.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "x1":
					case "y1":
					case "x2":
					case "y2":
						this.$getContainer().path	= cSVGElement_line.toPath(this);
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

	cSVGElement_line.toPath	= function(oElement) {
		var nX1	= oElement.getAttribute("x1") * 1,
			nY1	= oElement.getAttribute("y1") * 1,
			nX2	= oElement.getAttribute("x2") * 1,
			nY2	= oElement.getAttribute("y2") * 1;
		return "m" + [nX1, nY1].map(Math.round) + "l" + [nX2, nY2].map(Math.round) + "x";
	};

	// presentation
	cSVGElement_line.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-line' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
						style="position:absolute;top:0;left:0;height:100%;width:100%;"\
						path="' + cSVGElement_line.toPath(this) + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_line.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element
ample.extend(cSVGElement_line);
