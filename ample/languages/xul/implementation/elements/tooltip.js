/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tooltip	= function(){};
cXULElement_tooltip.prototype	= new cXULPopupElement;
cXULElement_tooltip.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Public Methods
cXULElement_tooltip.prototype.setAttribute   = function(sName, sValue)
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
cXULElement_tooltip.prototype.$getTagOpen		= function()
{
    return '<div style="display:none;position:absolute;" class="xul-tooltip">';
};

// Element Render: close
cXULElement_tooltip.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("tooltip", cXULElement_tooltip);
