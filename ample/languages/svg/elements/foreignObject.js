/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_foreignObject	= function(){};
cSVGElement_foreignObject.prototype	= new cSVGElement("foreignObject");

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
	cSVGElement_foreignObject.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			// Apply transform
			cSVGElement.applyTransform(this);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_foreignObject.prototype.$mapAttribute	= function(sName, sValue) {
		if (sName == "width" || sName == "height")
			this.$getContainer().style[sName]	= sValue + "px";
		else
		if (sName == "x" || sName == "y")
			oElement.style[sName == "x" ? "left" : "top"]	= sValue + "px";
		else
			cSVGElement.prototype.$mapAttribute.call(this, sName, sValue);
	};

	// presentation
	cSVGElement_foreignObject.prototype.$getTagOpen	= function() {
		var nOpacity= this.$getStyleComputed("opacity") * 1 || 1;
		return '<svg2vml:shape class="svg-foreignObject' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:' + this.getAttribute("width") + 'px;height:' + this.getAttribute("height") + 'px;left:' + this.getAttribute("x") + 'px;top:' + this.getAttribute("y") + 'px;filter:progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'clip\',enabled=false) progid:DXImageTransform.Microsoft.Alpha(' + (nOpacity != 1 ? 'opacity:' + nOpacity * 100 : 'enabled=false')+ ');"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_foreignObject.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element
ample.extend(cSVGElement_foreignObject);
