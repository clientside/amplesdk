/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
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
cXULElement_colorpicker.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "value")
    {
        this.$getContainer("input").value = sValue;
    }
    else
    if (sName == "disabled")
    {
    	this.$setPseudoClass("disabled", sValue == "true");
        this.$getContainer("input").disabled = sValue == "true";
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_colorpicker.prototype.toggle	= function(bState) {
	var oPane	= this.getPane();
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


// public methods
cXULElement_colorpicker.prototype.getPane	= function() {
	var oPane	= cXULElement_colorpicker.pane;
	if (!oPane) {
		// create a shared pane and hide it
		oPane	= this.ownerDocument.createElementNS(this.namespaceURI, "xul:colorpicker-pane");
		oPane.addEventListener("accept", function(oEvent) {
			// hide pane
			this.hidePopup();

			this.opener.setAttribute("value", this.getAttribute("value"));

			// dispatch change event
			var oEventChange	= this.ownerDocument.createEvent("UIEvent");
			oEventChange.initUIEvent("change", true, false, window, null);
			this.opener.dispatchEvent(oEventChange);

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
	if (oPane.parentNode != this)
		this.appendChild(oPane);
	return oPane;
};

// Events handlers
cXULElement_colorpicker.prototype._onChange	= function(oEvent)
{
    this.attributes["value"]    = this.$getContainer("input").value;

    // Fire Event
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", false, true);
    this.dispatchEvent(oEvent);
};

cXULElement_colorpicker.prototype._onWidgetAccept	= function(oEvent)
{
	var oPopup	= this.getPane();

    oPopup.setAttribute("value", oEvent.target.getAttribute("value"));
    oPopup.focus();

    // Fire Event
    oPopup._fireEventOnChange();

	// Close popup
	oPopup.toggle(false);
};

cXULElement_colorpicker.prototype._onWidgetCancel	= function(oEvent)
{
	var oPopup	= this.getPane();

	// Close popup
	oPopup.toggle(false);
};

cXULElement_colorpicker.prototype._fireEventOnChange	= function()
{
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
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	},
	"keydown":	function(oEvent) {
		switch (oEvent.keyIdentifier) {
    		case "Esc":
    		case "Tab":
            	this.toggle(false);
            	break;
    	}
	}
};

// Element Render: open
cXULElement_colorpicker.prototype.$getTagOpen	= function()
{
	return '<table class="xul-colorpicker' + (this.attributes["disabled"] == "true" ? " xul-colorpicker_disabled" : "") + '" cellpadding="0" cellspacing="0" border="0">\
				<tbody>\
					<tr>\
						<td width="100%"><input class="xul-colorpicker--input" type="text" autocomplete="off" value="' + this.attributes["value"] + '"' + (this.attributes["disabled"] == "true" ? ' disabled="true"' : '') +' maxlength="7" onchange="ample.$instance(this)._onChange(event)" style="border:0px solid white;width:100%;" onselectstart="event.cancelBubble=true;" /></td>\
						<td valign="top"><div class="xul-colorpicker--button"/></td>\
					</tr>\
					<tr><td class="xul-colorpicker--gateway" colspan="2"></td></tr>\
				</tbody>\
			</table>';
};

// Register Element with language
oXULNamespace.setElement("colorpicker", cXULElement_colorpicker);
