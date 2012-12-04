/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_polygon	= function(){};
cSVGElement_polygon.prototype	= new cSVGElement("polygon");

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
	cSVGElement_polygon.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

			// Apply gradients
			if ((sValue = this.$getStyleComputed("fill")) && sValue.substr(0, 3) == "url")
				this.$setStyle("fill", sValue);

			// Apply transformations
			cSVGElement.applyTransform(this);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_polygon.prototype.$mapAttribute	= function(sName, sValue) {
		if (sName == "points")
			this.$getContainer().path	= cSVGElement_polygon.toPath(this);
		else
			cSVGElement.prototype.$mapAttribute.call(this, sName, sValue);
	};

	cSVGElement_polygon.toPath	= function(oElement) {
		var aPoints	=(oElement.getAttribute("points") || '').split(/[ ,]/);
		return "m " + aPoints.slice(0, 2).map(Math.round)+ " l " + aPoints.slice(2).map(Math.round) + " x";
	};

	// presentation
	cSVGElement_polygon.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-polygon' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
						style="position:absolute;top:0;left:0;height:100%;width:100%;"\
						path="' + cSVGElement_polygon.toPath(this) + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_polygon.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element
ample.extend(cSVGElement_polygon);
