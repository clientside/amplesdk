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

if (!!document.namespaces) {
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
						oStyle[oEvent.attrName == "cx" ? "left" : "top"]		=(oEvent.newValue - this.getAttribute("r"))+ "px";
						break;

					case "r":
						oStyle["width"]		= oEvent.newValue * 2 + "px";
						oStyle["height"]	= oEvent.newValue * 2 + "px";
						oStyle["left"]		=(this.getAttribute("cx") - oEvent.newValue)+ "px";
						oStyle["top"]		=(this.getAttribute("cy") - oEvent.newValue)+ "px";
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
	cSVGElement_circle.prototype.$getTagOpen	= function() {
		var r	= this.getAttribute("r"),
			cx	= this.getAttribute("cx"),
			cy	= this.getAttribute("cy");
		return '<svg2vml:oval class="svg-circle' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:' + r * 2 + 'px;height:' + r * 2 + 'px;left:' + (cx - r) + 'px;top:' + (cy - r) + 'px;"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_circle.prototype.$getTagClose	= function() {
		return '</svg2vml:oval>';
	};
};

// Register Element with language
oSVGNamespace.setElement("circle", cSVGElement_circle);
