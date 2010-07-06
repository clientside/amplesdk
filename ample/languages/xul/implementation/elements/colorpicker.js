/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_colorpicker	= function(){};
cXULElement_colorpicker.prototype	= new cXULInputElement;

//
cXULElement_colorpicker.prototype.pane	= null;
cXULElement_colorpicker.prototype.hidden	= true;

cXULElement_colorpicker.attributes	= {};
cXULElement_colorpicker.attributes.value	= "";

// Public Methods
cXULElement_colorpicker.prototype.toggle	= function(bState) {
	if (bState === true || (!arguments.length && this.hidden)) {
		// Update pane state
		this.pane.setAttribute("value", this.getAttribute("value"));

		// show pane
		this.pane.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
	}
	else {
		this.pane.hidePopup();
	}
};

// Events handlers
cXULElement_colorpicker.prototype._onChange	= function(oEvent) {
    this.attributes["value"]    = this.$getContainer("input").value;

    // Fire Event
    cXULInputElement.dispatchChange(this);
};

// Class Events handlers
cXULElement_colorpicker.handlers	= {
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
		if (!cXULElement_colorpicker.hidden)
			this.toggle(false);
		this.$getContainer("input").blur();
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target == this) {
			var that	= this;
			// create a shared pane and hide it
			this.pane	= this.$appendChildAnonymous(this.ownerDocument.createElementNS(this.namespaceURI, "xul:colorpicker-pane"));
			this.pane.setAttribute("style", "display:none");
			this.pane.addEventListener("accept", function(oEvent) {
				// hide pane
				this.hidePopup();

				that.setAttribute("value", this.getAttribute("value"));

				// dispatch change event
				cXULInputElement.dispatchChange(that);

				that.focus();
			}, false);
			this.pane.addEventListener("cancel", function(oEvent) {
				// hide pane
				this.hidePopup();
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
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "value":
					this.$getContainer("input").value = oEvent.newValue || '';
					break;

				case "disabled":
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					this.$getContainer("input").disabled = oEvent.newValue == "true";
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

// Element Render: open
cXULElement_colorpicker.prototype.$getTagOpen	= function() {
	return '<div class="xul-colorpicker' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + (this.attributes["disabled"] == "true" ? " xul-colorpicker_disabled" : "") + '">\
				<div class="xul-colorpicker--field">\
					<div class="xul-colorpicker--button" onmousedown="return false;"><br /></div>\
					<input class="xul-colorpicker--input" type="text" autocomplete="off" value="' + this.attributes["value"] + '"' + (this.attributes["disabled"] == "true" ? ' disabled="true"' : '') +' maxlength="7" onchange="ample.$instance(this)._onChange(event)" style="border:0px solid white;width:100%;" onselectstart="event.cancelBubble=true;" />\
				</div>\
				<div class="xul-colorpicker--gateway">' + this.pane.$getTag() + '</div>\
			</div>';

	return '<table class="xul-colorpicker' + (this.attributes["disabled"] == "true" ? " xul-colorpicker_disabled" : "") + '" cellpadding="0" cellspacing="0" border="0">\
				<tbody>\
					<tr>\
						<td width="100%"><input class="xul-colorpicker--input" type="text" autocomplete="off" value="' + this.attributes["value"] + '"' + (this.attributes["disabled"] == "true" ? ' disabled="true"' : '') +' maxlength="7" onchange="ample.$instance(this)._onChange(event)" style="border:0px solid white;width:100%;" onselectstart="event.cancelBubble=true;" /></td>\
						<td valign="top"><div class="xul-colorpicker--button" onmousedown="return false;"/></td>\
					</tr>\
					<tr><td class="xul-colorpicker--gateway" colspan="2">' + this.pane.$getTag() + '</td></tr>\
				</tbody>\
			</table>';
};

// Register Element with language
oXULNamespace.setElement("colorpicker", cXULElement_colorpicker);
