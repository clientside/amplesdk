/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_circle	= function(){};
cSVGElement_circle.prototype	= new cSVGElement("circle");

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
	cSVGElement_circle.handlers	= {
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

	cSVGElement_circle.prototype.$mapAttribute	= function(sName, sValue) {
		if (sName == "cx" || sName == "cy" || sName == "r")
			this.$getContainer().path	= cSVGElement_circle.toPath(this);
		else
			cSVGElement.prototype.$mapAttribute.call(this, sName, sValue);
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

// Register Element
ample.extend(cSVGElement_circle);
