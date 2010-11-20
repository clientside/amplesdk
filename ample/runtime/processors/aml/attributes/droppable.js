/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAttr_droppable	= function(){};
cAttr_droppable.prototype	= new cAMLAttr("droppable");

// Class Events Handlers
cAttr_droppable.handlers		= {};
cAttr_droppable.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	this.ownerElement.$droppable	= this.value == "true";
};
cAttr_droppable.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	this.ownerElement.$droppable	= false;
};

// Register Attribute
fAmple_extend(cAttr_droppable);
