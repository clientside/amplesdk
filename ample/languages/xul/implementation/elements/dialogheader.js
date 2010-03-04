/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_dialogheader	= function(){};
cXULElement_dialogheader.prototype	= new cXULElement;
cXULElement_dialogheader.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;

// Attributes Defaults

// Public Methods
cXULElement_dialogheader.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "title")
        this.parentNode.$getContainer("label").innerHTML = sValue || " ";
    else
    if (sName == "description")
        this.parentNode.$getContainer("description").innerHTML = sValue || " ";

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_dialogheader.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_dialog) {
			this.parentNode.$getContainer("label").innerHTML	= this.getAttribute("title") || " ";
			this.parentNode.$getContainer("description").innerHTML	= this.getAttribute("description") || " ";
			this.parentNode.$getContainer("header").style.display	= "";
		}
	}
};

// Element Renders
cXULElement_dialogheader.prototype.$getTag	= function()
{
	return '';
};

// Register Element with language
oXULNamespace.setElement("dialogheader", cXULElement_dialogheader);
