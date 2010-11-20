/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAttr_draggable	= function(){};
cAttr_draggable.prototype	= new cAMLAttr("draggable");

// Class Events Handlers
cAttr_draggable.handlers	= {};
cAttr_draggable.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	this.ownerElement.$draggable	= this.value == "true";
};
cAttr_draggable.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	this.ownerElement.$draggable	= false;
};

// Register Attribute
fAmple_extend(cAttr_draggable);
