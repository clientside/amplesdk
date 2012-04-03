/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_time	= function(){};
cXHTMLElement_time.prototype	= new cXHTMLElement("time");

// Class Events Handlers
cXHTMLElement_time.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
	}
};

// Register Element
ample.extend(cXHTMLElement_time);
