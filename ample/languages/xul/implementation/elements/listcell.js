/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listcell	= function(){};
cXULElement_listcell.prototype	= new cXULElement;

// Public Methods

// Class Events Handlers
cXULElement_listcell.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listitem)
			this.parentNode.cells.$add(oEvent.target);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listitem)
			this.parentNode.cells.$remove(oEvent.target);
	}
}

// Element Render: open
cXULElement_listcell.prototype.$getTagOpen	= function()
{
    var sHtml   = '<td class="xul-listcell"><div class="xul-listcell--gateway">';
    if (this.attributes["image"])
        sHtml  += '<img src="' + this.attributes["image"] + '" align="absmiddle"/> ';
    if (this.attributes["label"])
        sHtml  += this.attributes["label"];

    return sHtml;
};

// Element Render: close
cXULElement_listcell.prototype.$getTagClose	= function()
{
    return '</div></td>';
};

// Register Element with language
oXULNamespace.setElement("listcell", cXULElement_listcell);
