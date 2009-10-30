/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_popup	= function(){};
cXULElement_popup.prototype	= new cXULPopupElement;
cXULElement_popup.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_popup.attributes	= {};
cXULElement_popup.attributes.orient	= "vertical";
cXULElement_popup.attributes.width	= "150";

// Public Methods
cXULElement_popup.prototype.setAttribute = function(sName, sValue)
{
    if (sName == "top")
    {
        if (!isNaN(sValue) && !isNaN(this.attributes["left"]))
            this.moveTo(this.attributes["left"] * 1, sValue * 1);
    }
    else
    if (sName == "left")
    {
        if (!isNaN(sValue) && !isNaN(this.attributes["top"]))
            this.moveTo(sValue * 1, this.attributes["top"] * 1);
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_popup.prototype.$getTagOpen	= function()
{
    return '<div style="display:none;position:absolute;width:' + this.attributes["width"] + 'px;" class="xul-popup" onmousedown="event.cancelBubble=true;" oncontextmenu="return false">';
};

// Element Render: close
cXULElement_popup.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("popup", cXULElement_popup);
