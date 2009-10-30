/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_groupbox	= function(){};
cXULElement_groupbox.prototype	= new cXULElement;
//cXULElement_groupbox.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_groupbox.attributes	= {};
cXULElement_groupbox.attributes.orient	= "vertical";

// Public Methods

// Element Render: open
cXULElement_groupbox.prototype.$getTagOpen		= function()
{
    var sHtml   = '<table cellpadding="0" cellspacing="0" border="0"' +(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : '')+ '' +(this.attributes["height"] ? ' height="' + this.attributes["height"] + '"' : '')+ ' class="xul-groupbox' +(this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
    sHtml  += '<thead>';
    sHtml  += '<tr>';
    sHtml  += '<td class="xul-groupbox-head-left"></td>';
    sHtml  += '<td class="xul-groupbox-head"><span class="xul-groupbox--caption xul-caption" style="display:none;"></span></td>';
    sHtml  += '<td class="xul-groupbox-head-right"></td>';
    sHtml  += '</tr>';
    sHtml  += '</thead>';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    sHtml  += '<td class="xul-groupbox-body-left"></td>';
    sHtml  += '<td height="100%" class="xul-groupbox-body">';

    return sHtml;
};

// Element Render: close
cXULElement_groupbox.prototype.$getTagClose	= function()
{
    var sHtml   = '</td>';
    sHtml  += '<td class="xul-groupbox-body-right"></td>';
    sHtml  += '</tr>';
    sHtml  += '</tbody>';
    sHtml  += '<tfoot>';
    sHtml  += '<tr>';
    sHtml  += '<td class="xul-groupbox-foot-left"></td>';
    sHtml  += '<td class="xul-groupbox-foot"></td>';
    sHtml  += '<td class="xul-groupbox-foot-right"></td>';
    sHtml  += '</tr>';
    sHtml  += '</tfoot>';
    sHtml  += '</table>';

    return sHtml;
};

// Register Element with language
oXULNamespace.setElement("groupbox", cXULElement_groupbox);
