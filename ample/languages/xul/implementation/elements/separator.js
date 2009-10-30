/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_separator	= function(){};
cXULElement_separator.prototype = new cXULElement;

// Public Methods

// Element Render: open
cXULElement_separator.prototype.$getTagOpen	= function()
{
	return '<div class="xul-separator" style="height:1.5em;width:1.5em;"><img height="1" width="1" /></div>';
};

// Register Element with language
oXULNamespace.setElement("separator", cXULElement_separator);
