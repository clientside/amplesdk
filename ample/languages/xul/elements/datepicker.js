/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// component constructor
var cXULElement_datepicker	= function() {
	//
	this.contentFragment	= ample.createDocumentFragment();
	this.popup		= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:datepicker-pane"));
	this.popup.setAttribute("hidden", "true");
	//
	var that	= this;
	this.popup.addEventListener("change", function(oEvent) {
		// hide pane
		this.hidePopup();

		that.setAttribute("value", this.getAttribute("value"));

		// dispatch change event
		cXULInputElement.dispatchChange(that);

		that.focus();
	}, false);
};

// component prototype
cXULElement_datepicker.prototype  = new cXULInputElement("datepicker");
cXULElement_datepicker.prototype.$selectable	= true;

//
cXULElement_datepicker.prototype.popup	= null;

// Public Methods
cXULElement_datepicker.prototype.toggle	= function(bState) {
	var bHidden	= this.popup.getAttribute("hidden") == "true";
	if (bState === true || (!arguments.length && bHidden)) {
		// Update pane state
		this.popup.setAttribute("min", this.getAttribute("min"));
		this.popup.setAttribute("max", this.getAttribute("max"));
		this.popup.setAttribute("value", this.getAttribute("value"));

		// show pane
		this.popup.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
	}
	else
	if (!bHidden) {
		this.popup.hidePopup();
	}
};

// handlers
cXULElement_datepicker.handlers	= {
	"mousedown":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		// prevent steeling focus by button
		if (oEvent.target == this && oEvent.button == 0 && oEvent.$pseudoTarget == this.$getContainer("button"))
			this.toggle();
	},
	"mouseenter":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		this.$setPseudoClass("hover", true, "button");
	},
	"mouseleave":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		this.$setPseudoClass("hover", false, "button");
	},
	"keydown":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		if (oEvent.keyIdentifier == "U+001B")	// Esc
			this.toggle(false);
	},
	// focus
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		if (this.popup.getAttribute("hidden") != "true")
			this.toggle(false);
		this.$getContainer("input").blur();
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			switch (oEvent.attrName) {
				case "value":
					this.$getContainer("input").value	= oEvent.newValue || '';
					break;

				case "min":
				case "max":
					break;

				case "disabled":
					this.$getContainer("input").disabled	= oEvent.newValue == "true";
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
	}
};

// component renderers
cXULElement_datepicker.prototype.$getTagOpen	= function() {
	return '<div class="xul-datepicker' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + (!this.$isAccessible() ? " xul-datepicker_disabled" : "") + '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '')+ '>\
				<div class="xul-datepicker--field">\
					<div class="xul-datepicker--button"><br /></div>\
					<input class="xul-datepicker--input" type="text" maxlength="10" value="' + this.getAttribute("value") + '"' + (!this.$isAccessible() ? ' disabled="true"' : "") +' style="border:0px solid white;width:100%;" />\
				</div>\
				<div class="xul-datepicker--gateway">' + this.popup.$getTag() + '</div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_datepicker);
