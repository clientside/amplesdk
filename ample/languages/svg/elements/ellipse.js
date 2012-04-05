/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_ellipse	= function(){};
cSVGElement_ellipse.prototype	= new cSVGElement("ellipse");

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
	cSVGElement_ellipse.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

			// Apply gradients
			if ((sValue = this.$getStyleComputed("fill")) && sValue.substr(0, 3) == "url")
				this.$setStyle("fill", sValue);

			// Apply transform
			cSVGElement.applyTransform(this);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_ellipse.prototype.$mapAttribute	= function(sName, sValue) {
		if (sName == "cx" || sName == "cy" || sName == "rx" || sName == "ry")
			this.$getContainer().path	= cSVGElement_ellipse.toPath(this);
		else
			cSVGElement.prototype.$mapAttribute.call(this, sName, sValue);
	};

	cSVGElement_ellipse.toPath	= function(oElement) {
		var nCx	= oElement.getAttribute("cx") * 1,
			nCy	= oElement.getAttribute("cy") * 1,
			nRx	= oElement.getAttribute("rx") * 1,
			nRy	= oElement.getAttribute("ry") * 1;
		return (nRx && nRy) ? ("at" + [nCx - nRx, nCy - nRy, nCx + nRx, nCy + nRy, nCx - nRx, nCy - nRy, nCx - nRx, nCy - nRy].map(Math.round) + "x") : "";
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

// Register Element
ample.extend(cSVGElement_ellipse);
