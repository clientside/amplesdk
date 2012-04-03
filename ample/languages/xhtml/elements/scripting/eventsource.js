/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_eventsource	= function(){};
cXHTMLElement_eventsource.prototype	= new cXHTMLElement("eventsource");

// Class Events Handlers
cXHTMLElement_eventsource.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
	}
};

// Register Element
ample.extend(cXHTMLElement_eventsource);
