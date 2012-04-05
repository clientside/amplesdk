/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr_selectable	= function(){};
cAMLAttr_selectable.prototype	= new cAMLAttr("selectable");

// Class Events Handlers
cAMLAttr_selectable.handlers	= {};
cAMLAttr_selectable.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	this.ownerElement.$selectable	= this.value == "true" ? true : this.value == "false" ? false : null;
};
cAMLAttr_selectable.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	this.ownerElement.$selectable	= null;
};

// Register Attribute
fAmple_extend(cAMLAttr_selectable);
