/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

// component constructor
var cXULElement_datepicker	= function() {

};

// component prototype
cXULElement_datepicker.prototype  = new cXULElement;

// Focus
cXULElement_datepicker.prototype.tabIndex	= 0;
cXULElement_datepicker.prototype.$isAccessible	= function() {
	return this.getAttribute("disabled") != "true";
};


// Static properties
cXULElement_datepicker.pane		= null;
cXULElement_datepicker.hidden	= true;

// public methods
cXULElement_datepicker.prototype.getPane	= function() {
	var oPane	= cXULElement_datepicker.pane;
	if (!oPane) {
		// create a shared pane and hide it
		oPane	= this.ownerDocument.createElementNS(this.namespaceURI, "xul:datepicker-pane");
		oPane.addEventListener("change", function(oEvent) {
			// hide pane
			this.hidePopup();

			this.opener.setAttribute("value", this.getAttribute("value"));

			// dispatch change event
			var oEventChange	= this.ownerDocument.createEvent("UIEvent");
			oEventChange.initUIEvent("change", true, false, window, null);
			this.opener.dispatchEvent(oEventChange);

			this.opener.focus();

			this.opener	= null;
		}, false);
		oPane.addEventListener("popupshown", function(oEvent) {
			cXULElement_datepicker.hidden	= false;
			this.ownerDocument.popupNode	= this;
		}, false);
		oPane.addEventListener("popuphidden", function(oEvent) {
			cXULElement_datepicker.hidden	= true;
			this.ownerDocument.popupNode	= null;
		}, false);

		cXULElement_datepicker.pane	= oPane;
	}

	if (oPane.parentNode != this)
		this.appendChild(oPane);

	return oPane;
};

cXULElement_datepicker.prototype.toggle	= function(bState) {
	var oPane	= this.getPane();
	if (bState === true || (!arguments.length && cXULElement_datepicker.hidden)) {
		// Update pane state
		oPane.setAttribute("min", this.getAttribute("min"));
		oPane.setAttribute("max", this.getAttribute("max"));
		oPane.setAttribute("value", this.getAttribute("value"));

		// show pane
		oPane.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
		oPane.opener		= this;
	}
	else {
		oPane.hidePopup();
		oPane.opener		= null;
	}
};

// handlers
cXULElement_datepicker.handlers	= {
	"mousedown":function(oEvent) {
		if (!this.$isAccessible())
			return;

		// prevent steeling focus by button
		if (oEvent.target == this && oEvent.$pseudoTarget == this.$getContainer("button")) {
			this.toggle();
			if (this.ownerDocument.activeElement != this)
				this.focus();
			oEvent.preventDefault();
		}
	},
	"mouseenter":function(oEvent) {
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

		if (oEvent.keyIdentifier == "Esc")
			this.toggle(false);
	},
	// focus
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			switch (oEvent.attrName) {
				case "value":
					this.$getContainer("input").value	= oEvent.newValue;
					break;

				case "min":
				case "max":
					break;

				case "disabled":
					this.$getContainer("input").disabled	= oEvent.newValue == "true";
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					break;
			}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.hasAttribute("accessKey"))
			this.accessKey	= this.getAttribute("accessKey");
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.hasAttribute("accessKey"))
			this.accessKey	= null;
	}
};

// component renderers
cXULElement_datepicker.prototype.$getTagOpen	= function() {
	return '<table class="xul-datepicker' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + (this.getAttribute('disabled') == "true" ? " xul-datepicker_disabled" : "") + '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '')+ ' cellpadding="0" cellspacing="0" border="0">\
				<tbody>\
					<tr>\
						<td width="100%"><div style="height:17px"><input type="text" maxlength="10" class="xul-datepicker--input"' + (this.hasAttribute("accessKey") ? ' accessKey="' + this.getAttribute("accessKey") + '"' : '')+ ' value="' + this.getAttribute("value") + '"' + (this.getAttribute('disabled') == "true" ? ' disabled="true"' : "") +' style="border:0px solid white;width:100%;"/></div></td>\
						<td valign="top"><div class="xul-datepicker--button"></div></td>\
					</tr>\
					<tr><td class="xul-colorpicker--gateway" colspan="2"></td></tr>\
				</tbody>\
			</table>';
};

// Register component with the language
oXULNamespace.setElement("datepicker", cXULElement_datepicker);
