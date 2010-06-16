/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cHTML5Element_fieldset	= function(){};
cHTML5Element_fieldset.prototype	= new cHTML5Element;

// Register Element with language
HTML5Namespace.setElement("fieldset", cHTML5Element_fieldset);

