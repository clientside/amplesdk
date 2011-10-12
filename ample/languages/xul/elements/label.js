/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_label	= function(){};
cXULElement_label.prototype  = new cXULElement("label");

// Public Methods

// Class Events Handlers
cXULElement_label.handlers	= {
	"DOMAttrModified": function (oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "value":
					this.$getContainer().innerHTML	= oEvent.newValue || '';
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"click":	function(oEvent) {
		if (oEvent.button == 0)
			this.$activate();
	},
	"DOMActivate":	function(oEvent) {
		var oControl;
		if (!oEvent.defaultPrevented)
			if (this.attributes["control"] && (oControl = this.ownerDocument.getElementById(this.attributes["control"])))
				oControl.focus();
	}
};

// Element Render: open
cXULElement_label.prototype.$getTagOpen	= function() {
    return '<label class="xul-label' +(this.attributes["class"] ? " " + this.attributes["class"] : "") + (!this.$isAccessible() ? " xul-label_disabled" : "") + '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '')+ '>' +(this.attributes["value"] ? this.attributes["value"] : '');
};

// Element Render: close
cXULElement_label.prototype.$getTagClose	= function() {
    return '</label>';
};

// Register Element
ample.extend(cXULElement_label);
