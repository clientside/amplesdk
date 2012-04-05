/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_checkbox	= function(){};
cXULElement_checkbox.prototype	= new cXULInputElement("checkbox");

cXULElement_checkbox.prototype.$hoverable	= true;

// Public Methods

// Class Events handlers
cXULElement_checkbox.handlers	= {
	"keydown":	function(oEvent) {
		if (oEvent.keyIdentifier == "U+0020") {
			this.$activate();
			cXULInputElement.dispatchChange(this);
		}
	},
	"click":	function(oEvent) {
		if (oEvent.button == 0) {
			this.$activate();
			cXULInputElement.dispatchChange(this);
		}
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.attrName == "value")
				this.setAttribute("checked", oEvent.newValue == "on" ? "true" : "false");
			else
			if (oEvent.attrName == "checked")
				this.setAttribute("value", oEvent.newValue == "true" ? "on" : "off");
		}
	},
	"DOMActivate":	function(oEvent) {
		this.setAttribute("checked", this.getAttribute("checked") == "true" ? "false" : "true");
	}
};

cXULElement_checkbox.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "disabled")
		this.$setPseudoClass("disabled", sValue == "true");
	else
	if (sName == "checked")
		this.$setPseudoClass("checked", sValue == "true");
	else
	if (sName == "label")
		this.$getContainer("label").innerHTML	= sValue || '';
	else
		cXULInputElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_checkbox.prototype.$getTagOpen		= function() {
	var bChecked	= this.attributes["checked"] == "true",
		bDisabled	= !this.$isAccessible();
	return '<div class="xul-checkbox' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + (bDisabled ? " xul-checkbox_disabled" : "") + (bChecked ? " xul-checkbox_checked" : "") + (bChecked && bDisabled ? " xul-checkbox_checked_disabled xul-checkbox_disabled_checked" : "") + '">\
				<div class="xul-checkbox--input"><br /></div>\
				<div class="xul-checkbox--label">' + (this.attributes["label"] ? ample.$encodeXMLCharacters(this.attributes["label"]) : '') + '</div>';
};

// Element Render: close
cXULElement_checkbox.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_checkbox);
