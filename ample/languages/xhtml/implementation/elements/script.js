/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_script	= function(){};
cXHTMLElement_script.prototype	= new cXHTMLElement;

// Register Element with language
oXHTMLNamespace.setElement("script", cXHTMLElement_script);
