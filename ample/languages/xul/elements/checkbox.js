/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
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
			switch (oEvent.attrName) {
				case "disabled":
			    	this.$setPseudoClass("disabled", oEvent.newValue == "true");
			        break;

		    	case "value":
		    		this.setAttribute("checked", oEvent.newValue == "on" ? "true" : "false");
			        break;

		    	case "checked":
			        this.setAttribute("value", oEvent.newValue == "true" ? "on" : "off");
			        this.$setPseudoClass("checked", oEvent.newValue == "true");
			        break;

		    	case "label":
		    		this.$getContainer("label").innerHTML = oEvent.newValue || '';
		    		break;

		    	default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMActivate":	function(oEvent) {
		this.setAttribute("checked", this.getAttribute("checked") == "true" ? "false" : "true");
	}
};

// Element Render: open
cXULElement_checkbox.prototype.$getTagOpen		= function() {
	var bChecked	= this.attributes["checked"] == "true",
		bDisabled	= !this.$isAccessible();
	return '<div class="xul-checkbox' + (bDisabled ? " xul-checkbox_disabled" : "") + (bChecked ? " xul-checkbox_checked" : "") + (bChecked && bDisabled ? " xul-checkbox_checked_disabled xul-checkbox_disabled_checked" : "") + '">\
				<div class="xul-checkbox--input"><br /></div>\
				<div class="xul-checkbox--label">' +(this.attributes["label"] || '')+ '</div>';
};

// Element Render: close
cXULElement_checkbox.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_checkbox);
