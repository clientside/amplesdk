/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAttr_resizable	= function(){};
cAttr_resizable.prototype	= new cAMLAttr("resizable");

// Class Events Handlers
cAttr_resizable.handlers	= {};
cAttr_resizable.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	this.ownerElement.$resizable	= this.value == "true";
};
cAttr_resizable.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	this.ownerElement.$resizable	= false;
};

// Register Attribute
fAmple_extend(cAttr_resizable);
