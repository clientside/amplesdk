/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_radio	= function(){};
cXULElement_radio.prototype   = new cXULElement;

cXULElement_radio.prototype.group	= null;

// Public Methods
cXULElement_radio.prototype.$isAccessible	= function() {
	return this.getAttribute("disabled") != "true" && (this.group ? this.group.$isAccessible() : true);
};

// Events Handlers
cXULElement_radio.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
		this.setAttribute("selected", "true");
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "disabled":
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					this.$getContainer("input").disabled	= oEvent.newValue == "true";
					break;

				case "label":
					this.$getContainer("label").innerHTML = oEvent.newValue || '';
					break;

				case "value":
					this.$getContainer("input").value    = oEvent.newValue || '';
					break;

				case "selected":
					if (oEvent.newValue == "true") {
						// deselect previously selected radio
						if (this.group.items[this.group.selectedIndex])
							this.group.items[this.group.selectedIndex].setAttribute("selected", "false");

						this.group.selectedIndex    = this.group.items.$indexOf(this);
						this.group.selectedItem     = this.group.items[this.group.selectedIndex];
						this.group.attributes["value"]  = this.attributes["value"];
					}
					else {
						this.group.selectedIndex    =-1;
						this.group.selectedItem     = null;
						this.group.attributes["value"]  = "";
					}
					this.$getContainer("input").checked	= oEvent.newValue == "true";
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
			this.$getContainer("input").name	= oElement.uniqueID + "_radio";
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
			this.$getContainer("input").name	= "";
			oElement.items.$remove(this);
			this.group   = null;
		}
	}
};

cXULElement_radio.prototype._onClick = function(oEvent) {
    if (this.group) {
        this.setAttribute("selected", "true");

	    // Fire Event
        cXULInputElement.dispatchChange(this.group);
    }
};

// Element Render: open
cXULElement_radio.prototype.$getTagOpen	= function() {
    var sHtml   = '<label class="xul-radio' + ((this.group && this.group.attributes["disabled"] == "true") || this.attributes["disabled"] == "true" ? " xul-radio_disabled" : "") + (this.attributes["selected"] == "true" ? " xul-radio_selected" : "") + '">';
    sHtml	+= '<input type="radio" autocomplete="off"';
    if (this.attributes["value"])
        sHtml  += ' value="' + this.attributes["value"] + '"';
    if (this.attributes["selected"] == "true")
        sHtml  += ' checked="true"';
    if (this.attributes["disabled"] == "true")
        sHtml  += ' disabled="true"';
    sHtml  += ' onclick="ample.$instance(this)._onClick(event)" class="xul-radio--input" />';
    sHtml  += '<span class="xul-radio--label">' + (this.attributes["label"] ? this.attributes["label"] : '') + '</span>';


    return sHtml;
};

// Element Render: close
cXULElement_radio.prototype.$getTagClose	= function() {
    return '</label>';
};

// Register Element with language
oXULNamespace.setElement("radio", cXULElement_radio);
