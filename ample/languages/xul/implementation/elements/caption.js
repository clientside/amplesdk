/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_caption	= function(){};
cXULElement_caption.prototype	= new cXULElement;
cXULElement_caption.prototype.viewType   = cXULElement.VIEW_TYPE_VIRTUAL;

// Public Methods
cXULElement_caption.prototype.setAttribute	= function(sName, sValue)
{
    // ensure the parent is groupbox
    if (!(this.parentNode instanceof cXULElement_groupbox))
        return;

    if (sName == "label")
    {
        this.parentNode.$getContainer("caption").innerHTML =(oElement.attributes["image"] ? '<img src="' + oElement.attributes["image"] + '" align="absmiddle" /> ' : '')+ sValue;
    }
    else
    if (sName == "image")
    {
        this.parentNode.$getContainer("caption").innerHTML = '<img src="' + sValue + '" align="absmiddle" /> ' + (this.attributes["label"] ? this.attributes["label"] : '');
    }
    else
    if (sName == "hidden")
    {
        this.parentNode.$getContainer("caption").style.display = sValue == "true" ? "none" : "";
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Class Events Handlers
cXULElement_caption.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.parentNode.$getContainer("caption").innerHTML	= (this.hasAttribute("image") ? '<img src="' + this.getAttribute("image") + '" align="absmiddle" /> ' : '')+(this.hasAttribute("label") ? this.getAttribute("label") : '');
		if (this.getAttribute("hidden") != "true")
			this.parentNode.$getContainer("caption").style.display = "";
	}
};

// Register Element with language
oXULNamespace.setElement("caption", cXULElement_caption);
