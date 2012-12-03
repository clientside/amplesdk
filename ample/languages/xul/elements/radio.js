/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_radio	= function(){};
cXULElement_radio.prototype	= new cXULElement("radio");

cXULElement_radio.prototype.$hoverable	= true;

cXULElement_radio.prototype.group	= null;

// Public Methods
cXULElement_radio.prototype.$isAccessible	= function() {
	return this.getAttribute("disabled") != "true" && (this.group ? this.group.$isAccessible() : true);
};

// Events Handlers
cXULElement_radio.handlers	= {
	"click":	function(oEvent) {
		if (oEvent.button == 0) {
			this.setAttribute("selected", "true");
			// Fire Event
			if (this.group)
				cXULInputElement.dispatchChange(this.group);
		}
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.attrName == "selected") {
				var oGroup	= this.group;
				if (oGroup) {
					if (oEvent.newValue == "true") {
						// deselect previously selected radio
						if (oGroup.selectedItem)
							oGroup.selectedItem.setAttribute("selected", "false");

						oGroup.selectedIndex	= this.group.items.$indexOf(this);
						oGroup.selectedItem		= this;
						oGroup.setAttribute("value", this.getAttribute("value") || '');
					}
					else {
						oGroup.selectedIndex	=-1;
						oGroup.selectedItem		= null;
						oGroup.setAttribute("value", "");
					}
				}
			}
		}
	}
};

cXULElement_radio.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "disabled")
		this.$setPseudoClass("disabled", sValue == "true");
	else
	if (sName == "label")
		this.$getContainer("label").innerHTML	= sValue || '';
	else
	if (sName == "selected")
		this.$setPseudoClass("selected", sValue == "true");
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_radio.prototype.$getTagOpen		= function() {
	var bSelected	= this.getAttribute("selected") == "true",
		bDisabled	= !this.$isAccessible();
	return '<div class="xul-radio' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + (bDisabled ? " xul-radio_disabled" : "") + (bSelected ? " xul-radio_selected" : "") + (bSelected && bDisabled ? " xul-radio_selected_disabled xul-radio_disabled_selected" : "") + '">\
				<div class="xul-radio--input"><br /></div>\
				<div class="xul-radio--label">' +(this.hasAttribute("label") ? ample.$encodeXMLCharacters(this.getAttribute("label")) : '')+ '</div>';
};

// Element Render: close
cXULElement_radio.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_radio);
