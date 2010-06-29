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

};

// component prototype
cXULElement_datepicker.prototype  = new cXULInputElement;

//
cXULElement_datepicker.prototype.hidden	= true;
cXULElement_datepicker.prototype.pane	= true;

// Public Methods
cXULElement_datepicker.prototype.toggle	= function(bState) {
	if (bState === true || (!arguments.length && this.hidden)) {
		// Update pane state
		this.pane.setAttribute("min", this.getAttribute("min"));
		this.pane.setAttribute("max", this.getAttribute("max"));
		this.pane.setAttribute("value", this.getAttribute("value"));

		// show pane
		this.pane.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
	}
	else {
		this.pane.hidePopup();
	}
};

// handlers
cXULElement_datepicker.handlers	= {
	"mousedown":function(oEvent) {
		if (!this.$isAccessible())
			return;

		// prevent steeling focus by button
		if (oEvent.target == this && oEvent.button == 0 && oEvent.$pseudoTarget == this.$getContainer("button"))
			this.toggle();
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
		if (!this.hidden)
			this.toggle(false);
		this.$getContainer("input").blur();
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target == this) {
			var that	= this;
			// create a shared pane and hide it
			this.pane	= this.$appendChildAnonymous(this.ownerDocument.createElementNS(this.namespaceURI, "xul:datepicker-pane"));
			this.pane.setAttribute("style", "display:none");
			this.pane.addEventListener("change", function(oEvent) {
				// hide pane
				this.hidePopup();

				that.setAttribute("value", this.getAttribute("value"));

				// dispatch change event
				cXULInputElement.dispatchChange(this.opener);

				that.focus();
			}, false);
			this.pane.addEventListener("popupshown", function(oEvent) {
				that.hidden	= false;
				this.ownerDocument.popupNode	= this;
			}, false);
			this.pane.addEventListener("popuphidden", function(oEvent) {
				that.hidden	= true;
				this.ownerDocument.popupNode	= null;
			}, false);
		}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target == this) {
			this.$removeChildAnonymous(this.pane);
			this.pane	= null;
		}
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
	return '<table class="xul-datepicker' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + (this.getAttribute('disabled') == "true" ? " xul-datepicker_disabled" : "") + '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '')+ ' cellpadding="0" cellspacing="0" border="0">\
				<tbody>\
					<tr>\
						<td width="100%"><input class="xul-datepicker--input" type="text" maxlength="10" value="' + this.getAttribute("value") + '"' + (this.getAttribute('disabled') == "true" ? ' disabled="true"' : "") +' style="border:0px solid white;width:100%;" /></td>\
						<td valign="top"><div class="xul-datepicker--button" onmousedown="return false;"></div></td>\
					</tr>\
					<tr><td class="xul-datepicker--gateway" colspan="2">' + this.pane.$getTag() + '</td></tr>\
				</tbody>\
			</table>';
};

// Register component with the language
oXULNamespace.setElement("datepicker", cXULElement_datepicker);
