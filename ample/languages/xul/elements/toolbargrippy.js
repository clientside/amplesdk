/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_toolbargrippy	= function(){};
cXULElement_toolbargrippy.prototype  = new cXULElement("toolbargrippy");

// Class Events Handlers
cXULElement_toolbargrippy.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Element Render: open
cXULElement_toolbargrippy.prototype.$getTagOpen	= function() {
    return (this.parentNode instanceof cXULElement_menubar ? "<td>" : "") + '<div class="xul-toolbargrippy"><br /></div>';
};

cXULElement_toolbargrippy.prototype.$getTagClose	= function() {
	return this.parentNode instanceof cXULElement_menubar ? "</td>" : "";
};

// Register Element
ample.extend(cXULElement_toolbargrippy);
