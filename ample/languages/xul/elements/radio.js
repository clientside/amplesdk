/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_radio	= function(){};
cXULElement_radio.prototype   = new cXULElement("radio");

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
			switch (oEvent.attrName) {
				case "disabled":
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					break;

				case "label":
					this.$getContainer("label").innerHTML = oEvent.newValue || '';
					break;

				case "value":
					break;

				case "selected":
					var oGroup	= this.group;
					if (oGroup) {
						if (oEvent.newValue == "true") {
							// deselect previously selected radio
							if (oGroup.selectedItem)
								oGroup.selectedItem.setAttribute("selected", "false");

							oGroup.selectedIndex	= this.group.items.$indexOf(this);
							oGroup.selectedItem		= this;
							oGroup.attributes["value"]  = this.attributes["value"];
						}
						else {
							oGroup.selectedIndex	=-1;
							oGroup.selectedItem		= null;
							oGroup.attributes["value"]  = "";
						}
					}
					this.$setPseudoClass("selected", oEvent.newValue == "true");
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		for (var oElement = this; oElement; oElement = oElement.parentNode)
			if (oElement instanceof cXULElement_radiogroup)
				break;
		if (oElement) {
			oElement.items.$add(this);
			this.group   = oElement;
			//
			if (this.attributes["selected"] == "true") {
				oElement.selectedIndex	= oElement.items.length - 1;
				oElement.selectedItem	= this;
			}
		}
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		for (var oElement = this; oElement; oElement = oElement.parentNode)
			if (oElement instanceof cXULElement_radiogroup)
				break;
		if (oElement) {
			if (this.attributes["selected"] == "true") {
				if (oElement.selectedItem == this) {
					oElement.selectedIndex	=-1;
					oElement.selectedItem	= null;
				}
			}
			//
			oElement.items.$remove(this);
			this.group   = null;
		}
	}
};

// Element Render: open
cXULElement_radio.prototype.$getTagOpen		= function() {
	var bSelected	= this.attributes["selected"] == "true",
		bDisabled	= !this.$isAccessible();
	return '<div class="xul-radio' + (bDisabled ? " xul-radio_disabled" : "") + (bSelected ? " xul-radio_selected" : "") + (bSelected && bDisabled ? " xul-radio_selected_disabled xul-radio_disabled_selected" : "") + '">\
				<div class="xul-radio--input"><br /></div>\
				<div class="xul-radio--label">' +(this.attributes["label"] || '')+ '</div>';
};

// Element Render: close
cXULElement_radio.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_radio);
