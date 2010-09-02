/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_option	= function(){};
cXHTMLElement_option.prototype	= new cXHTMLElement("option");
cXHTMLElement_option.prototype.$selectable	= false;
cXHTMLElement_option.prototype.$hoverable	= true;

// Class Events Handlers
cXHTMLElement_option.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
	}
};

// Register Element
ample.extend(cXHTMLElement_option);
