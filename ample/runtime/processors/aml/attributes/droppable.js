/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr_droppable	= function(){};
cAMLAttr_droppable.prototype	= new cAMLAttr("droppable");

// Class Events Handlers
cAMLAttr_droppable.handlers		= {};
cAMLAttr_droppable.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	this.ownerElement.$droppable	= this.value == "true";
};
cAMLAttr_droppable.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	this.ownerElement.$droppable	= false;
};

// Register Attribute
fAmple_extend(cAMLAttr_droppable);
