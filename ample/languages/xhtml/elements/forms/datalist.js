/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_datalist	= function(){};
cXHTMLElement_datalist.prototype	= new cXHTMLElement("datalist");

// Class Events Handlers
cXHTMLElement_datalist.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			this.$mapAttribute(Event.attrName, oEvent.newValue);
	}
};

// Register Element
ample.extend(cXHTMLElement_datalist);


