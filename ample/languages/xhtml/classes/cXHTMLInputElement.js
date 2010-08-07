/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cHTMLInputElement	= function() {
	cXHTMLElement.apply(this, arguments);
};

cHTMLInputElement.prototype	= new cXHTMLElement("#element-input");

// Accessibility
cHTMLInputElement.prototype.tabIndex	= 0;

// Register Element
ample.extend(cHTMLInputElement);