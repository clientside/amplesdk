/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_statusbarpanel	= function(){};
cXULElement_statusbarpanel.prototype = new cXULElement;

// Attributes Defaults
cXULElement_statusbarpanel.attributes	= {};
cXULElement_statusbarpanel.attributes.align	= "center";

// Public Methods
cXULElement_statusbarpanel.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "image")
    {
        this.$getContainer().innerHTML    = '<img src="' + this.attributes["image"] + '" align="absmiddle"/>';
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_statusbarpanel.prototype.$getTagOpen	= function()
{
    var sHtml   = '<div class="xul-statusbarpanel">';
    if (this.attributes["image"])
        sHtml  += '<img src="' + this.attributes["image"] + '" align="absmiddle"/>';
    else
    if (this.attributes["label"])
        sHtml  += this.attributes["label"];
//    else
//        sHtml  += ' ';
    return sHtml;
};

// Element Render: close
cXULElement_statusbarpanel.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("statusbarpanel", cXULElement_statusbarpanel);
