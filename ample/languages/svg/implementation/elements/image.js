/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_image	= function(){};
cSVGElement_image.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// handlers
	cSVGElement_image.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "xlink:href":
						this.$getContainer("image").src	= oEvent.newValue;
						break;
					//
					case "width":
					case "height":
						var aValue	= oEvent.newValue.match(/([\d.]+)([%\w]*)/);
						oElement.style[oEvent.attrName]	= aValue[1] + (aValue[2] || "px");
						break;
					//
					case "x":
					case "y":
						oElement.style["margin" +(oEvent.attrName == "x" ? "Left" : "Top")]	= oEvent.newValue + "px";
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
	cSVGElement_image.prototype.$getTagOpen	= function() {
		var aWidth	= this.getAttribute("width").match(/([\d.]+)([%\w]*)/),
			aHeight	= this.getAttribute("height").match(/([\d.]+)([%\w]*)/);
		return '<svg2vml:group class="svg-image' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:' + aWidth[1] + (aWidth[2] || 'px') + ';height:' + aHeight[1] + (aHeight[2] || 'px') + ';margin-left:' + this.getAttribute("x") + 'px;margin-top:' + this.getAttribute("y") + 'px;"\
				>\
					<svg2vml:rect class="svg-image--shape" style="width:100%;height:100%;">\
						<svg2vml:stroke on="false" />\
						<svg2vml:imagedata src="' + this.getAttribute("xlink:href")+ '" class="svg-image--image"/>\
					</svg2vml:rect>';
	};

	cSVGElement_image.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

// Register Element with language
oSVGNamespace.setElement("image", cSVGElement_image);

