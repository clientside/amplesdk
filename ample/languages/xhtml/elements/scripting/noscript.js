/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_noscript	= function(){};
cXHTMLElement_noscript.prototype	= new cXHTMLElement("noscript");

// Register Element
ample.extend(cXHTMLElement_noscript);
