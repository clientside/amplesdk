/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_colorpicker	= function(){};
cXULElement_colorpicker.prototype	= new cXULElement;
cXULElement_colorpicker.prototype.tabIndex	= 0;

// Static properties
cXULElement_colorpicker.pane	= null;
cXULElement_colorpicker.hidden	= true;

cXULElement_colorpicker.attributes	= {};
cXULElement_colorpicker.attributes.value	= "";

// Public Methods
cXULElement_colorpicker.prototype.toggle	= function(bState) {
	var oPane	= cXULElement_colorpicker.getPane(this);
	if (bState === true || (!arguments.length && cXULElement_colorpicker.hidden)) {
		// Update pane state
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

// Events handlers
cXULElement_colorpicker.prototype._onChange	= function(oEvent) {
    this.attributes["value"]    = this.$getContainer("input").value;

    // Fire Event
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", false, true);
    this.dispatchEvent(oEvent);
};

cXULElement_colorpicker.prototype._onWidgetAccept	= function(oEvent) {
	var oPopup	= cXULElement_colorpicker.getPane(this);

    oPopup.setAttribute("value", oEvent.target.getAttribute("value"));
    oPopup.focus();

    // Fire Event
    oPopup._fireEventOnChange();

	// Close popup
	oPopup.toggle(false);
};

cXULElement_colorpicker.prototype._onWidgetCancel	= function(oEvent) {
	var oPopup	= cXULElement_colorpicker.getPane(this);

	// Close popup
	oPopup.toggle(false);
};

cXULElement_colorpicker.prototype._fireEventOnChange	= function() {
    // Fire Event
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", false, true);
    this.dispatchEvent(oEvent);
};

// Class Events handlers
cXULElement_colorpicker.handlers	= {
	"mousedown":function(oEvent) {
		if (!this.$isAccessible())
			return;

		// prevent steeling focus by button
		if (oEvent.target == this && oEvent.$pseudoTarget == this.$getContainer("button"))
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
	// focus
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		if (!cXULElement_colorpicker.hidden)
			this.toggle(false);
		this.$getContainer("input").blur();
	},
	"keydown":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		if (oEvent.keyIdentifier == "Esc")
			this.toggle(false);
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

// Static Methods
cXULElement_colorpicker.getPane	= function(oInstance) {
	var oPane	= cXULElement_colorpicker.pane;
	if (!oPane) {
		// create a shared pane and hide it
		oPane	= oInstance.ownerDocument.createElementNS(oInstance.namespaceURI, "xul:colorpicker-pane");
		oPane.addEventListener("accept", function(oEvent) {
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
		oPane.addEventListener("cancel", function(oEvent) {
			// hide pane
			this.hidePopup();

			this.opener	= null;
		}, false);
		oPane.addEventListener("popupshown", function(oEvent) {
			cXULElement_colorpicker.hidden	= false;
			this.ownerDocument.popupNode	= this;
		}, false);
		oPane.addEventListener("popuphidden", function(oEvent) {
			cXULElement_colorpicker.hidden	= true;
			this.ownerDocument.popupNode	= null;
		}, false);

		cXULElement_colorpicker.pane	= oPane;
	}
	if (oPane.parentNode != oInstance)
		oInstance.appendChild(oPane);
	return oPane;
};

// Element Render: open
cXULElement_colorpicker.prototype.$getTagOpen	= function() {
	return '<table class="xul-colorpicker' + (this.attributes["disabled"] == "true" ? " xul-colorpicker_disabled" : "") + '" cellpadding="0" cellspacing="0" border="0">\
				<tbody>\
					<tr>\
						<td width="100%"><input class="xul-colorpicker--input" type="text" autocomplete="off" value="' + this.attributes["value"] + '"' + (this.attributes["disabled"] == "true" ? ' disabled="true"' : '') +' maxlength="7" onchange="ample.$instance(this)._onChange(event)" style="border:0px solid white;width:100%;" onselectstart="event.cancelBubble=true;" /></td>\
						<td valign="top"><div class="xul-colorpicker--button" onmousedown="return false;"/></td>\
					</tr>\
					<tr><td class="xul-colorpicker--gateway" colspan="2"></td></tr>\
				</tbody>\
			</table>';
};

// Register Element with language
oXULNamespace.setElement("colorpicker", cXULElement_colorpicker);
