/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_vbox	= function(){};
cXULElement_vbox.prototype	= new cXULElement_box;

// Attributes Defaults
cXULElement_vbox.attributes	= {};
cXULElement_vbox.attributes.orient	= "vertical";

// Register Element with language
oXULNamespace.setElement("vbox", cXULElement_vbox);
