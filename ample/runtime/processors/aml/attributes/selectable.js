/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAttr_selectable	= function(){};
cAttr_selectable.prototype	= new cAMLAttr("selectable");

// Class Events Handlers
cAttr_selectable.handlers	= {};
cAttr_selectable.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	this.ownerElement.$selectable	= this.value == "true" ? true : this.value == "false" ? false : null;
};
cAttr_selectable.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	this.ownerElement.$selectable	= null;
};

// Register Attribute
fAmple_extend(cAttr_selectable);
