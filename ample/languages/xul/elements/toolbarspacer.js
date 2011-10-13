/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_toolbarspacer	= function(){};
cXULElement_toolbarspacer.prototype	= new cXULElement("toolbarspacer");

// Class Events Handlers
cXULElement_toolbarspacer.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Element Render: open
cXULElement_toolbarspacer.prototype.$getTagOpen	= function() {
    return '<div class="xul-toolbarspacer' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '"><br /></div>';
};

// Register Element
ample.extend(cXULElement_toolbarspacer);
