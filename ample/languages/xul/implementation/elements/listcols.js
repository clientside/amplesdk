/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listcols	= function()
{
    // Collections
    this.items  = new AMLNodeList;
};
cXULElement_listcols.prototype	= new cXULElement;

// Public Methods

// Element Render: open
cXULElement_listcols.prototype.$getTagOpen	= function()
{
    return '<table cellpadding="0" cellspacing="0" border="0" width="100%" class="xul-listcols">\
				<tbody>\
					<tr>';
};

// Element Render: close
cXULElement_listcols.prototype.$getTagClose	= function()
{
	return			'</tr>\
				</tbody>\
			</table>';
};

// Register Element with language
oXULNamespace.setElement("listcols", cXULElement_listcols);
