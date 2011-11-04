/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2011 Sergey Ilinsky, Tudor Holton
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_overlay	= function(){};
cXULElement_overlay.prototype	= new cXULElement("overlay");

// Class Events Handlers
cXULElement_overlay.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Element Render: open
cXULElement_overlay.prototype.$getTagOpen	= function() {
    return '<div class="xul-overlay' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '"><br /></div>';
};

// Register Element
ample.extend(cXULElement_overlay);
