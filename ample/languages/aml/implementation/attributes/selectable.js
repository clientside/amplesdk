/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr_selectable	= function(){};

cAMLAttr_selectable.prototype	= new AMLAttr;

// Class Events Handlers
cAMLAttr_selectable.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.ownerElement.$selectable	= this.value == "true" ? true : this.value == "false" ? false : null;
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.ownerElement.$selectable	= null;
	}
};

// Register Attribute with language
oAMLNamespace.setAttribute("selectable", cAMLAttr_selectable);
