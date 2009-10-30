/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_wizardpage	= function(){};
cXULElement_wizardpage.prototype = new cXULElement;
cXULElement_wizardpage.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_wizardpage.attributes	= {};
cXULElement_wizardpage.attributes.hidden	= "true";

// Public Methods
cXULElement_wizardpage.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "label")
    {
        if (this.parentNode.currentPage == this)
            this.parentNode.$getContainer("label").innerHTML		= sValue;
    }
    else
    if (sName == "description")
    {
        if (this.parentNode.currentPage == this)
            this.parentNode.$getContainer("description").innerHTML	= sValue;
    }
    else
    if (sName == "next")
    {

    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_wizardpage.prototype._fireEventOnPage    = function(sName)
{
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("page" + sName, false, true);

    return this.dispatchEvent(oEvent);
};

// Element Render: open
cXULElement_wizardpage.prototype.$getTagOpen	= function()
{
    return '<div class="xul-wizardpage"' +(this.attributes["hidden"] == "true" ? ' style="display:none"' : '')+ '>';
};

// Element Render: close
cXULElement_wizardpage.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("wizardpage", cXULElement_wizardpage);
