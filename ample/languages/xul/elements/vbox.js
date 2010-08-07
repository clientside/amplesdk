/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_vbox	= function(){};
cXULElement_vbox.prototype	= new cXULElement_box;
cXULElement_vbox.prototype.localName	= "vbox";

// Attributes Defaults
cXULElement_vbox.attributes	= {};
cXULElement_vbox.attributes.orient	= "vertical";

// Class Events Handlers
cXULElement_vbox.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

// Register Element
ample.extend(cXULElement_vbox);
