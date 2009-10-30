/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_description	= function(){};
cXULElement_description.prototype    = new cXULElement;

// Public Methods
cXULElement_description.prototype.setAttribute   = function(sName, sValue)
{
    if (sName == "value")
    {
        this.$getContainer().innerHTML    = sValue;
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_description.prototype.$getTagOpen		= function()
{
    return '<div class="xul-description' +(this.attributes["class"] ? " " + this.attributes["class"] : '')+ '" style="width:100%;height:100%;">' + (this.attributes["value"] || "");
};

// Element Render: close
cXULElement_description.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("description", cXULElement_description);
