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

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
	cSVGElement_image.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "xlink:href":
						oElement.imagedata.src	= oEvent.newValue;
						break;
					//
					case "width":
					case "height":
						var aValue	= oEvent.newValue.match(/([\d.]+)([%\w]*)/);
						oElement.style[oEvent.attrName]	= aValue[1] + (aValue[2] || "px");
						break;
					case "x":
					case "y":
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

			// Apply transform
			cSVGElement.applyTransform(this);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_image.resolveXmlBase	= function(oElement, sUri) {
		for (var oNode = oElement, sBaseUri = ''; oNode.nodeType != 9; oNode = oNode.parentNode)
			if (sBaseUri = oNode.getAttribute("xml:base"))
				sUri	= oElement.ownerDocument.$resolveUri(sUri, sBaseUri);
		return oElement.ownerDocument.$resolveUri(sUri, String(document.location));
	};

	// presentation
	cSVGElement_image.prototype.$getTagOpen	= function() {
		var aWidth	= this.getAttribute("width").match(/([\d.]+)([%\w]*)/),
			aHeight	= this.getAttribute("height").match(/([\d.]+)([%\w]*)/),
			nOpacity= cSVGElement.getStyle(this, "opacity") * 1 || 1;
		return '<svg2vml:shape class="svg-image' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;padding:10cm;width:' + aWidth[1] + (aWidth[2] || 'px') + ';height:' + aHeight[1] + (aHeight[2] || 'px') + ';left:' + this.getAttribute("x") + 'px;top:' + this.getAttribute("y") + 'px;filter:progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'clip\',enabled=false) progid:DXImageTransform.Microsoft.Alpha(' + (nOpacity != 1 ? 'opacity:' + nOpacity * 100 : 'enabled=false')+ ')" stroked="false"\
				>\
					<svg2vml:imagedata src="' + cSVGElement_image.resolveXmlBase(this, this.getAttribute("xlink:href"))+ '"/>';
	};

	cSVGElement_image.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element with language
oSVGNamespace.setElement("image", cSVGElement_image);

