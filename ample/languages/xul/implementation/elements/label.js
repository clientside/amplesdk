/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_label	= function(){};
cXULElement_label.prototype  = new cXULElement;

// Public Methods
cXULElement_label.prototype.setAttribute = function(sName, sValue)
{
    if (sName == "value")
    {
        this.$getContainer().innerText    = sValue;
    }
    else
    if (sName == "control")
    {
//        this.$getContainer().setAttribute("for", sValue);
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_label.prototype.$getTagOpen	= function()
{
//' +(this.attributes["control"] ? ' for="' + this.attributes["control"] + '"': '')+ '
    return '<label class="xul-label' +(this.attributes["class"] ? " " + this.attributes["class"] : "")+ '">' +(this.attributes["value"] ? this.attributes["value"] : '');
};

// Element Render: close
cXULElement_label.prototype.$getTagClose	= function()
{
    return '</label>';
};

// Register Element with language
oXULNamespace.setElement("label", cXULElement_label);
