/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_grid	= function() {
    this.cols   = new AMLNodeList;
    this.rows   = new AMLNodeList;
};
cXULElement_grid.prototype	= new cXULElement("grid");

// Attributes Defaults
cXULElement_grid.attributes	= {};
cXULElement_grid.attributes.orient	= "vertical";

// Class Events Handlers
cXULElement_grid.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Register Element
ample.extend(cXULElement_grid);
