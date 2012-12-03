/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_timepicker	= function() {
	//
	this.contentFragment	= ample.createDocumentFragment();
	this.spinButtons		= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:spinbuttons"));
	//
	var that	= this;
	this.spinButtons.addEventListener("spin", function(oEvent) {
		var aTime	= that.getAttribute("value").split(":"),
			aRange	= cXULInputElement.getSelectionRange(that);
		var sComponent	= cXULElement_timepicker.getEditComponent(that),
			nComponent;
		switch (sComponent) {
			case 'h':
				nComponent	= aTime[0] * 1 + (oEvent.detail ? 1 :-1);
				if (nComponent > 23)
					nComponent	= 0;
				else
				if (nComponent < 0)
					nComponent	= 23;
				aTime[0]	= (nComponent.toString().length < 2 ? '0' : '') + nComponent;
				break;
			case 'm':
				nComponent	= aTime[1] * 1 + (oEvent.detail ? 1 :-1);
				if (nComponent > 59)
					nComponent	= 0;
				else
				if (nComponent < 0)
					nComponent	= 59;
				aTime[1]	= (nComponent.toString().length < 2 ? '0' : '') + nComponent;
				break;
			case 's':
			default:
				nComponent	= aTime[2] * 1 + (oEvent.detail ? 1 :-1);
				if (nComponent > 59)
					nComponent	= 0;
				else
				if (nComponent < 0)
					nComponent	= 59;
				aTime[2]	= (nComponent.toString().length < 2 ? '0' : '') + nComponent;
		}
		that.setAttribute("value", aTime.join(':'));
		cXULElement_timepicker.setEditComponent(that, sComponent);
	}, false);
};
cXULElement_timepicker.prototype	= new cXULInputElement("timepicker");

// Default attributes
cXULElement_timepicker.attributes	= {
	"mask":		'hh:mm:ss',
	"value":	'00:00:00'
};


cXULElement_timepicker.prototype._onInputTimeChange	= function(oEvent, sName, sValue) {
	this._setValue(sName, sValue);

	// Fire Event
	cXULInputElement.dispatchChange(this);
};

// Class handlers
cXULElement_timepicker.handlers	= {
	"focus":	function(oEvent) {
		var oInput	= this.$getContainer("input");
		oInput.focus();
		cXULElement_timepicker.setEditComponent(this, oInput.lastCursorPosition || 'h');
	},
	"blur":		function(oEvent) {
		var oInput	= this.$getContainer("input");
		oInput.lastCursorPosition	= cXULElement_timepicker.getEditComponent(this);
		oInput.blur();
	},
	"keydown":	function(oEvent) {
		if (oEvent.keyIdentifier == "Up") {
			this.spinButtons.spin(true);
			oEvent.preventDefault();
		}
		else
		if (oEvent.keyIdentifier == "Down") {
			this.spinButtons.spin(false);
			oEvent.preventDefault();
		}
		else
		if (oEvent.keyIdentifier == "Left") {
			switch (cXULElement_timepicker.getEditComponent(this)) {
				case "s":
					cXULElement_timepicker.setEditComponent(this, 'm');
					break;
				case "m":
					cXULElement_timepicker.setEditComponent(this, 'h');
					break;
			}
			oEvent.preventDefault();
		}
		else
		if (oEvent.keyIdentifier == "Right") {
			switch (cXULElement_timepicker.getEditComponent(this)) {
				case "m":
					cXULElement_timepicker.setEditComponent(this, 's');
					break;
				case "h":
					cXULElement_timepicker.setEditComponent(this, 'm');
					break;
			}
			oEvent.preventDefault();
		}
	},
	"mouseup":	function(oEvent) {
		if (oEvent.$pseudoTarget == this.$getContainer("input"))
			cXULElement_timepicker.setEditComponent(this, cXULElement_timepicker.getEditComponent(this));
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.attrName == "disabled") {
				this.spinButtons.setAttribute("disabled", oEvent.newValue == "true" ? "true" : "false");
			}
		}
	}
};

cXULElement_timepicker.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "disabled")
		this.$setPseudoClass("disabled", sValue == "true");
	else
	if (sName == "value")
		this.$getContainer("input").value	= sValue || '';
	else
		cXULInputElement.prototype.$mapAttribute.call(this, sName, sValue);
};

cXULElement_timepicker.getEditComponent	= function(oInstance) {
	var aRange	= cXULInputElement.getSelectionRange(oInstance);
	if (aRange[1] > 5)
		return 's';
	else
	if (aRange[1] > 2)
		return 'm';
	else
		return 'h';
};

cXULElement_timepicker.setEditComponent	= function(oInstance, sComponent) {
	var nStart	= 0,
		nEnd	= 8;
	switch (sComponent) {
		case 's':
			nStart	= 6;
			nEnd	= 8;
			break;
		case 'm':
			nStart	= 3;
			nEnd	= 5;
			break;
		case 'h':
		default:
			nStart	= 0;
			nEnd	= 2;
			break;
	}
	cXULInputElement.setSelectionRange(oInstance, nStart, nEnd);
};

// Element Render: open
cXULElement_timepicker.prototype.$getTagOpen		= function() {
	var aTime	= this.getAttribute("value").split(":");
	return '<div class="xul-timepicker' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + (!this.$isAccessible() ? " xul-timepicker_disabled" : '') + '">\
				<div class="xul-timepicker--field">\
						' + this.spinButtons.$getTag() + '\
					<input type="text" class="xul-timepicker--input" maxlength="8"' +(!this.$isAccessible() ? ' disabled="true"' : '')+ ' style="border:0px solid white;width:100%;" value="' + (aTime ? aTime[0] : "00") + ':' + (aTime ? aTime[1] : "00") + ':' + (aTime ? aTime[2] : "00") + '" />\
				</div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_timepicker);
