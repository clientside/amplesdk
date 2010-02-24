/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_a	= function(){};
cSVGElement_a.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
	cSVGElement_a.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "href":
						cSVGElement_a.setHref(this, oEvent.newValue);
						break;
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue	= this.getAttribute("xlink:href");
			if (sValue != "")
				cSVGElement_a.setHref(this, sValue);
		},
		'mouseenter':	function(oEvent) {
			cSVGElement_a.recalcCSS(this);
		},
		'mouseleave':	function(oEvent) {
			cSVGElement_a.recalcCSS(this);
		}
	};

	// Static members
	cSVGElement_a.recalcCSS	= function(oElement) {
		for (var nIndex = 0, oChild, oElementDOM; oChild = oElement.childNodes[nIndex]; nIndex++)
			if (oChild.nodeType == 1) {
				if (oChild instanceof cSVGElement_g)
					cSVGElement_a.recalcCSS(oChild);
				else
					cSVGElement.applyCSS(oChild);
			}
	};

	cSVGElement_a.setHref	= function(oElement, sValue) {
		for (var nIndex = 0, oChild, oElementDOM; oChild = oElement.childNodes[nIndex]; nIndex++) {
			if (oChild instanceof cSVGElement_g)
				cSVGElement_a.setHref(oChild, sValue);
			else
			if (oChild instanceof cSVGElement_text)
				oChild.$getContainer().getElementsByTagName("shape")[0].href	= sValue;
			else
			if (oChild.nodeType == 1) {
				oElementDOM	= oChild.$getContainer();
				if (oElementDOM)
					oElementDOM.href	= sValue;
			}
		}
	};

	// presentation
	cSVGElement_a.prototype.$getTagOpen	= function() {
		return '<svg2vml:group class="svg-a' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:100%;height:100%;left:0;top:0;"\
				>';
	};

	cSVGElement_a.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

// Register Element with language
oSVGNamespace.setElement("a", cSVGElement_a);
