/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listcol	= function(){};
cXULElement_listcol.prototype    = new cXULElement;

// Public Methods
cXULElement_listcol.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "sortDirection")
    {
        // natural | descending | descending
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Class event handler
cXULElement_listcol.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listcols)
			this.parentNode.items.$add(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listcols)
			this.parentNode.items.$remove(this);
	}
};

// Element Render: open
cXULElement_listcol.prototype.$getTagOpen	= function()
{
    return '<td class="xul-listcol"><img height="1"/></td>';
};

// Register Element with language
oXULNamespace.setElement("listcol", cXULElement_listcol);
