/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr_resizable	= function(){};
cAMLAttr_resizable.prototype	= new cAMLAttr("resizable");

// Class Events Handlers
cAMLAttr_resizable.handlers	= {};
cAMLAttr_resizable.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	this.ownerElement.$resizable	= this.value == "true";
};
cAMLAttr_resizable.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	this.ownerElement.$resizable	= false;
};

// Register Attribute
fAmple_extend(cAMLAttr_resizable);
