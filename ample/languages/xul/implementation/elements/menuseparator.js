/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_menuseparator	= function(){};
cXULElement_menuseparator.prototype  = new cXULElement;

// Public Methods

// Element Render: open
cXULElement_menuseparator.prototype.$getTagOpen	= function()
{
    return '<tr>\
    			<td colspan="4"><div class="xul-menuseparator"><br /></div></td>\
    		</tr>';
};

// Register Element with language
oXULNamespace.setElement("menuseparator", cXULElement_menuseparator);
