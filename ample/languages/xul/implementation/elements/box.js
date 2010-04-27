/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_box	= function(){};

cXULElement_box.prototype	= new cXULElement;
cXULElement_box.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Class Handlers
cXULElement_box.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

cXULElement_box.prototype.$getContainer	= function(sName) {
	return sName == "gateway" ? this.$getContainer("box") : document.getElementById(this.uniqueID);
};

// Register Element with language
oXULNamespace.setElement("box", cXULElement_box);
