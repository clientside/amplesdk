/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2011 Sergey Ilinsky, Tudor Holton
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_overlay	= function(){};
cXULElement_overlay.prototype	= new cXULElement("overlay");


// Element Render: open
cXULElement_overlay.prototype.$getTagOpen	= function() {
	return '';
};

// Register Element
ample.extend(cXULElement_overlay);
