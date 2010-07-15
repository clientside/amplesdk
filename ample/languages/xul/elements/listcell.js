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
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName)  {
				case "label":
			        this.$getContainer("gateway").innerHTML  =(this.attributes["src"] ? '<img src="' + this.attributes["src"] + '" align="absmiddle" /> ' :'') + (oEvent.newValue || '');
					break;

				case "src":
			        this.$getContainer("gateway").innerHTML  =(oEvent.newValue ? '<img src="' + oEvent.newValue + '" align="absmiddle" /> ' :'') + (this.attributes["label"] || '');
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listitem)
			this.parentNode.cells.$add(oEvent.target);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listitem)
			this.parentNode.cells.$remove(oEvent.target);
	}
};

// Element Render: open
cXULElement_listcell.prototype.$getTagOpen	= function()
{
	var oHeader	= this.parentNode.parentNode.parentNode.firstChild.childNodes[this.parentNode.childNodes.$indexOf(this)];
    var sHtml   = '<td class="xul-listcell"' + (oHeader && oHeader.attributes["hidden"] == "true" ? ' style="display:none"' : '') + '><div class="xul-listcell--box"><div class="xul-listcell--label xul-listcell--gateway">';
    if (this.attributes["image"])
        sHtml  += '<img src="' + this.attributes["image"] + '" align="absmiddle"/> ';
    if (this.attributes["label"])
        sHtml  += this.attributes["label"];

    return sHtml;
};

// Element Render: close
cXULElement_listcell.prototype.$getTagClose	= function()
{
    return '</div></div></td>';
};

// Register Element with language
oXULNamespace.setElement("listcell", cXULElement_listcell);
