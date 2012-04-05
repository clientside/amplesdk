/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr_resize_edges	= function(){};
cAMLAttr_resize_edges.prototype	= new cAMLAttr("resize-edges");

// Class Events Handlers
cAMLAttr_resize_edges.handlers	= {};
cAMLAttr_resize_edges.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	var aValue	= this.value.split(' ');
	this.ownerElement.$resizeEdges	=	(aValue.indexOf("top")		>-1 ? 1 : 0) +
										(aValue.indexOf("right")	>-1 ? 2 : 0) +
										(aValue.indexOf("bottom")	>-1 ? 4 : 0) +
										(aValue.indexOf("left")		>-1 ? 8 : 0);
};
cAMLAttr_resize_edges.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	this.ownerElement.$resizeEdges	= 0;
};

// Register Attribute
fAmple_extend(cAMLAttr_resize_edges);
