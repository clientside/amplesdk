/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_fieldset	= function()
{
	this.elements	= new AMLNodeList;
};
cXHTMLElement_fieldset.prototype	= new cXHTMLElement;

// Register Element with language
oXHTMLNamespace.setElement("fieldset", cXHTMLElement_fieldset);
