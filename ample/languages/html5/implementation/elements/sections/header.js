/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cHTML5Element_header	= function(){};
cHTML5Element_header.prototype	= new cHTML5Element;

// Register Element with language
oHTML5Namespace.setElement("header", cHTML5Element_header);
