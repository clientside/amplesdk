/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_span	= function(){};
cXHTMLElement_span.prototype	= new cXHTMLElement;

// Class Events Handlers
cXHTMLElement_span.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
	}
};

// Register Element with language
oXHTMLNamespace.setElement("span", cXHTMLElement_span);
