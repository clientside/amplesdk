/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listcol	= function(){};
cXULElement_listcol.prototype	= new cXULElement("listcol");

// Class event handler
cXULElement_listcol.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.attrName == "sortDirection") {
				// TODO: natural | descending | descending
			}
		}
	}
};

// Element Render: open
cXULElement_listcol.prototype.$getTagOpen	= function() {
	return '<td class="xul-listcol' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '"><br /></td>';
};

// Register Element
ample.extend(cXULElement_listcol);
