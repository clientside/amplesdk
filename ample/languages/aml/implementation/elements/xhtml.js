/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLElement_xhtml	= function(){};
cAMLElement_xhtml.prototype	= new cAMLElement;

// Public properties
cAMLElement_xhtml.prototype.innerHTML	= null;

cAMLElement_xhtml.prototype.$getTag	= function()
{
	return this.innerHTML;
};

// Register Element with language
oAMLNamespace.setElement("xhtml", cAMLElement_xhtml);
