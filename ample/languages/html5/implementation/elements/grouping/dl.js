/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cHTML5Element_dl	= function(){};
cHTML5Element_dl.prototype	= new cHTML5Element;

// Register Element with language
oHTML5Namespace.setElement("dl", cHTML5Element_dl);
