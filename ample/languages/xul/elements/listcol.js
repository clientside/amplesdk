/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listcol	= function(){};
cXULElement_listcol.prototype    = new cXULElement("listcol");

// Class event handler
cXULElement_listcol.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "sortDirection":
					// TODO: natural | descending | descending
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
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
cXULElement_listcol.prototype.$getTagOpen	= function() {
    return '<td class="xul-listcol' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '"><br /></td>';
};

// Register Element
ample.extend(cXULElement_listcol);
