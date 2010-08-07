/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_columns	= function(){};
cXULElement_columns.prototype	= new cXULElement("columns");

// Class Event Handlers
cXULElement_columns.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Element Render: open
cXULElement_columns.prototype.$getTagOpen	= function() {
    return '<thead class="xul-columns">';
};

// Element Render: close
cXULElement_columns.prototype.$getTagClose	= function() {
    return '</thead>';
};

// Register Element
ample.extend(cXULElement_columns);
