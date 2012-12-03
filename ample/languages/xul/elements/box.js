/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_box	= function(){};

cXULElement_box.prototype	= new cXULElement("box");
cXULElement_box.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Renderers
cXULElement_box.prototype.$getTagOpen	= function() {
	var sWidth	= this.getAttribute("width"),
		sHeight	= this.getAttribute("height");
	return '<div class="xul-' + this.localName +(this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '" style="' +
		(sWidth ? 'width:' + (isNaN(parseInt(sWidth)) ? sWidth : sWidth + 'px;') : '')+
		(sHeight ? 'height:' + (isNaN(parseInt(sHeight)) ? sHeight : sHeight + 'px;') : '')+
	'">';
};

cXULElement_box.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_box);
