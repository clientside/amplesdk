/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_section	= function(){};
cXHTMLElement_section.prototype	= new cXHTMLElement("section");

// Class Events Handlers
cXHTMLElement_section.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
	}
};

// Register Element
ample.extend(cXHTMLElement_section);
