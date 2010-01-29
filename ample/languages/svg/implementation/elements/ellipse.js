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
						oStyle.left		=(oEvent.newValue - this.getAttribute("rx"))+ "px";
						break;

					case "cy":
						oStyle.top		=(oEvent.newValue - this.getAttribute("ry"))+ "px";
						break;

					case "rx":
						oStyle.width	= oEvent.newValue * 2 + "px";
						oStyle.left		=(this.getAttribute("cx") - oEvent.newValue)+ "px";
						break;

					case "ry":
						oStyle.height	= oEvent.newValue * 2 + "px";
						oStyle.top		=(this.getAttribute("cy") - oEvent.newValue)+ "px";
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

	// presentation
	cSVGElement_ellipse.prototype.$getTagOpen	= function() {
		var rx	= this.getAttribute("rx"),
			ry	= this.getAttribute("ry"),
			cx	= this.getAttribute("cx"),
			cy	= this.getAttribute("cy");
		return '<svg2vml:oval class="svg-ellipse' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:' + rx * 2 + 'px;height:' + ry * 2 + 'px;left:' + (cx - rx) + 'px;top:' + (cy - ry) + 'px;"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_ellipse.prototype.$getTagClose	= function() {
		return '</svg2vml:oval>';
	};
};

// Register Element with language
oSVGNamespace.setElement("ellipse", cSVGElement_ellipse);
