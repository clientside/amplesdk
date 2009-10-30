/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_h1	= function(){};
cXHTMLElement_h1.prototype	= new cXHTMLElement;

// Register Element with language
oXHTMLNamespace.setElement("h1", cXHTMLElement_h1);
