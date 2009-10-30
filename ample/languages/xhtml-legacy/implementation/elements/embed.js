/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_embed	= function(){};
cXHTMLElement_embed.prototype	= new cXHTMLElement;

// Register Element with language
oXHTMLNamespace.setElement("embed", cXHTMLElement_embed);