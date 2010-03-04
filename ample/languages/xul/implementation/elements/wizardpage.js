/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_wizardpage	= function(){};
cXULElement_wizardpage.prototype = new cXULElement;
cXULElement_wizardpage.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_wizardpage.attributes	= {};
cXULElement_wizardpage.attributes.hidden	= "true";
cXULElement_wizardpage.attributes.orient	= "vertical";
cXULElement_wizardpage.attributes.width		= "100%";
cXULElement_wizardpage.attributes.height	= "100%";

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

cXULElement_wizardpage.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.parentNode.wizardPages.$add(this);
		//
		if (this.parentNode.attributes["pagestep"] == this.parentNode.childNodes.$indexOf(this) || this.parentNode.attributes["firstpage"] == this.attributes["pageid"])
			this.parentNode.goTo(this.attributes["pageid"]);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.parentNode.wizardPages.$remove(this);
	}
}

// Element Render: open
cXULElement_wizardpage.prototype.$getTagOpen	= function()
{
    return '<div class="xul-wizardpage" style="' +(this.attributes["hidden"] == "true" ? 'display:none;' : '')+ 'height:100%">';
};

// Element Render: close
cXULElement_wizardpage.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("wizardpage", cXULElement_wizardpage);
