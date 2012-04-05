/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_image	= function(){};
cSVGElement_image.prototype	= new cSVGElement("image");

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
	cSVGElement_image.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			// Apply transform
			cSVGElement.applyTransform(this);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_image.prototype.$mapAttribute	= function(sName, sValue) {
		if (sName == "width" || sName == "height") {
			var aValue	= sValue.match(/([\d.]+)([%\w]*)/);
			this.$getContainer().style[sName]	= aValue[1] + (aValue[2] || "px");
		}
		else
		if (sName == "xlink:href")
			this.$getContainer().imagedata.src	= cSVGElement_image.resolveXmlBase(this, sValue);
		else
			cSVGElement.prototype.$mapAttribute.call(this, sName, sValue);
	};

	cSVGElement_image.resolveXmlBase	= function(oElement, sUri) {
		for (var oNode = oElement, sBaseUri = ''; oNode != null && oNode.nodeType != 9; oNode = oNode.parentNode)
			if (sBaseUri = oNode.getAttribute("xml:base"))
				sUri	= ample.resolveUri(sUri, sBaseUri);
		return ample.resolveUri(sUri, String(document.location));
	};

	// presentation
	cSVGElement_image.prototype.$getTagOpen	= function() {
		var aWidth	= this.getAttribute("width").match(/([\d.]+)([%\w]*)/),
			aHeight	= this.getAttribute("height").match(/([\d.]+)([%\w]*)/),
			nOpacity= this.$getStyleComputed("opacity") * 1 || 1;
		return '<svg2vml:shape class="svg-image' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;padding:10cm;width:' + aWidth[1] + (aWidth[2] || 'px') + ';height:' + aHeight[1] + (aHeight[2] || 'px') + ';left:' + this.getAttribute("x") + 'px;top:' + this.getAttribute("y") + 'px;filter:progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'clip\',enabled=false) progid:DXImageTransform.Microsoft.Alpha(' + (nOpacity != 1 ? 'opacity:' + nOpacity * 100 : 'enabled=false')+ ')" stroked="false"\
				>\
					<svg2vml:imagedata src="' + cSVGElement_image.resolveXmlBase(this, this.getAttribute("xlink:href"))+ '"/>';
	};

	cSVGElement_image.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element
ample.extend(cSVGElement_image);
