/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_description	= function(){};
cXULElement_description.prototype    = new cXULElement;

// Class Events Handlers
cXULElement_description.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "value":
					this.$getContainer().innerHTML    = oEvent.newValue || '';
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

// Element Render: open
cXULElement_description.prototype.$getTagOpen		= function() {
    return '<div class="xul-description' +(this.attributes["class"] ? " " + this.attributes["class"] : '')+ '" style="width:100%;height:100%;">' + (this.attributes["value"] || "");
};

// Element Render: close
cXULElement_description.prototype.$getTagClose	= function() {
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("description", cXULElement_description);
