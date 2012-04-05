/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_grid	= function() {
	this.cols	= new ample.classes.NodeList;
	this.rows	= new ample.classes.NodeList;
};
cXULElement_grid.prototype	= new cXULElement("grid");

cXULElement_grid.prototype.$getTagOpen	= function() {
	var sWidth	= this.attributes.width,
		sHeight	= this.attributes.height;
	return '<div class="xul-grid' +(this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="' +
		(sWidth ? 'width:' + (isNaN(parseInt(sWidth)) ? sWidth : sWidth + 'px;') : '')+
		(sHeight ? 'height:' + (isNaN(parseInt(sHeight)) ? sHeight : sHeight + 'px;') : '')+
	'">';
};

cXULElement_grid.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_grid);
