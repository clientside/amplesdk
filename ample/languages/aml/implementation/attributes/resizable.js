/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr_resizable	= function(){};

cAMLAttr_resizable.prototype	= new AMLAttr;

// Class Events Handlers
cAMLAttr_resizable.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.ownerElement.$resizable	= this.value == "true";
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.ownerElement.$resizable	= false;
	}
};

// Register Attribute with language
oAMLNamespace.setAttribute("resizable", cAMLAttr_resizable);
