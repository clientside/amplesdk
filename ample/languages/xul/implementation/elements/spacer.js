/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_spacer	= function(){};
cXULElement_spacer.prototype = new cXULElement;

// Public Methods

// Element Render: open
cXULElement_spacer.prototype.$getTagOpen	= function()
{
    var sHtml   = '<div class="xul-spacer" style="';
    sHtml  += 'width:'  +(this.attributes["width"] ? this.attributes["width"] : '0')+ 'px;';
    sHtml  += 'height:' +(this.attributes["height"]? this.attributes["height"]: '0')+ 'px;';
    sHtml  += '"><img height="1" width="1" /></div>';

    return sHtml;
};

// Register Element with language
oXULNamespace.setElement("spacer", cXULElement_spacer);
