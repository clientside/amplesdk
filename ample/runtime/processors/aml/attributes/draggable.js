/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr_draggable	= function(){};
cAMLAttr_draggable.prototype	= new cAMLAttr("draggable");

// Class Events Handlers
cAMLAttr_draggable.handlers	= {};
cAMLAttr_draggable.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	this.ownerElement.$draggable	= this.value == "true";
};
cAMLAttr_draggable.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	this.ownerElement.$draggable	= false;
};

// Register Attribute
fAmple_extend(cAMLAttr_draggable);
