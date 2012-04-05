/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAUIElement_xhtml	= function(){};
cAUIElement_xhtml.prototype	= new cAUIElement("xhtml");

// Public properties
cAUIElement_xhtml.prototype.innerHTML	= null;

cAUIElement_xhtml.prototype.$getTag	= function() {
	return this.innerHTML;
};

// Register Element
ample.extend(cAUIElement_xhtml);
