/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_g	= function(){};
cSVGElement_g.prototype	= new cSVGElement("g");

if (cSVGElement.useVML) {
	// Implementation for IE

	// Class Event Handlers
	cSVGElement_g.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "transform":
						cSVGElement.applyTransform(this);
						break;

					default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		}
	};

	// presentation
	cSVGElement_g.prototype.$getTagOpen	= function() {
		// Keep left:0 and top:0
		return '<svg2vml:group class="svg-g' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="top:0;left:0;width:100%;height:100%;position:absolute;' + (this.hasAttribute("style") ? this.getAttribute("style") : '')+ '"\
				>';
	};

	cSVGElement_g.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

// Register Element
ample.extend(cSVGElement_g);
