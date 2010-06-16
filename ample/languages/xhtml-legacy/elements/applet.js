/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_applet	= function(){};
cXHTMLElement_applet.prototype	= new cXHTMLElement;

// Register Element with language
oXHTMLNamespace.setElement("applet", cXHTMLElement_applet);
