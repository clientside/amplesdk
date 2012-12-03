/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_script	= function(){};
cXULElement_script.prototype	= new cXULElement("script");

// Attributes Defaults
cXULElement_script.attributes	= {};
cXULElement_script.attributes.hidden	= "true";

// Public Methods

// Element Handlers
cXULElement_script.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.hasAttribute("src"))
			this.$getContainer().src	= this.getAttribute("src");
		else
		if (this.firstChild) {
			var oElement	= document.body.appendChild(document.createElement("script"));
			oElement.type	= "text/javascript";
			oElement.text	= this.firstChild.nodeValue;
		}
	}
};

cXULElement_script.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "src") {
		if (sValue)
			this.$getContainer().src	= sValue || '';
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_script.prototype.$getTagOpen	= function() {
	return '<script type="text/javascript">';
};

// Element Render: close
cXULElement_script.prototype.$getTagClose	= function() {
	return '</script>';
};

// Register Element
ample.extend(cXULElement_script);
