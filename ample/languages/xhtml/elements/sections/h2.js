/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_h2	= function(){};
cXHTMLElement_h2.prototype	= new cXHTMLElement("h2");

// Class Events Handlers
cXHTMLElement_h2.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
	}
};

// Register Element
ample.extend(cXHTMLElement_h2);
