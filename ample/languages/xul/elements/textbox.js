/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_textbox	= function(){
	//
	this.contentFragment	= ample.createDocumentFragment();
	this.spinButtons		= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:spinbuttons"));
	//
	var that	= this;
	this.spinButtons.addEventListener("spin", function(oEvent) {
		var nValue	=(that.getAttribute("value") * 1 || 0) + (oEvent.detail ? 1 :-1);
		if (nValue >= that.getAttribute("min") * 1 && nValue <= that.getAttribute("max") * 1) {
			that.setAttribute("value", nValue);
			cXULInputElement.dispatchChange(this);
		}
	}, false);
};
cXULElement_textbox.prototype	= new cXULInputElement("textbox");
cXULElement_textbox.prototype.$selectable	= true;

// Attributes Defaults
cXULElement_textbox.attributes	= {
	"min":		"0",
	"max":		"Infinity",
	"increment":"1",
	"value":	""
};

// Class Events Handlers
cXULElement_textbox.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
		// Hide placeholder
		this.$getContainer("placeholder").style.display	= "none";
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
		// Show placeholder
		if (!this.$getContainer("input").value)
			this.$getContainer("placeholder").style.display	= "";
	},
	"keydown":	function(oEvent) {
		if (this.getAttribute("type") == "number") {
			if (oEvent.keyIdentifier == "Up" || oEvent.keyIdentifier == "Down")
				this.spinButtons.spin(oEvent.keyIdentifier == "Up");
		}
	},
	"keyup":	function(oEvent) {
		this.setAttribute("value", this.$getContainer("input").value);
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.attrName == "disabled") {
				if (this.getAttribute("type") == "number")
					this.spinButtons.setAttribute("disabled", oEvent.newValue == "true" ? "true" : "false");
			}
			else
			if (oEvent.attrName == "type") {
				// TODO
			}
			else
			if (oEvent.attrName == "maxlength") {
				// TODO
			}
		}
	}
};

cXULElement_textbox.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "value") {
		this.$getContainer("placeholder").style.display	= sValue ? "none" : '';
		this.$getContainer("input").value	= sValue || '';
	}
	else
	if (sName == "disabled") {
		this.$setPseudoClass("disabled", sValue == "true");
		this.$getContainer("input").disabled	= sValue == "true";
	}
	else
	if (sName == "readonly")
		this.$getContainer("input").readOnly	= sValue == "true";
	else
	if (sName == "placeholder")
		this.$getContainer("placeholder").innerHTML	= ample.$encodeXMLCharacters(sValue || '');
	else
	if (sName == "type") {
		// TODO
	}
	else
	if (sName == "multiline") {
		// TODO
	}
	else
	if (sName == "row") {
		if (this.getAttribute("multiline") == "true")
			this.$getContainer("input").rows	= sValue || '';
	}
	else
	if (sName == "cols") {
		if (this.getAttribute("multiline") == "true")
			this.$getContainer("input").cols	= sValue || '';
	}
	else
		cXULInputElement.prototype.$mapAttribute.call(this, sName, sValue);
};

cXULElement_textbox.prototype._onChange	= function(oEvent) {
	// Fire Event
	cXULInputElement.dispatchChange(this);
};

// Element Render: open
cXULElement_textbox.prototype.$getTagOpen	= function(oElement) {
	var bMultiline	= this.getAttribute("multiline") == "true";
	return	'<div class="xul-textbox' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + (bMultiline ? ' xul-textbox-multiline-true' : '') + " xul-textbox-type-" + (this.getAttribute("type") || '') + (!this.$isAccessible() ? " xul-textbox_disabled" : '')+ '" style="'+
				(this.hasAttribute("height") ? 'height:' + this.getAttribute("height") + ';' : '')+
				(this.hasAttribute("width") ? 'width:' + this.getAttribute("width") + ';' : '')+
				(this.hasAttribute("style") ? this.getAttribute("style") : '')+'">\
				<div class="xul-textbox--placeholder" style="position:absolute;' + (this.getAttribute("value") == '' ? '' : 'display:none')+ '" onmousedown="var o = ample.$instance(this); setTimeout(function(){o.$getContainer(\'input\').focus();o.$getContainer(\'input\').select()}, 0)">' + (this.hasAttribute("placeholder") ? ample.$encodeXMLCharacters(this.getAttribute("placeholder")) : '') + '</div>\
				<div class="xul-textbox--field">\
					' + (this.getAttribute("type") == "number" ? this.spinButtons.$getTag() : this.getAttribute("type") == "search" ? '<div class="xul-textbox--button" onmousedown="return false"></div>' : '')+ '\
					<' +
					(bMultiline
						?("textarea" + (this.hasAttribute("rows") ? ' rows="' + this.getAttribute("rows") + '"' : '')+(this.hasAttribute("cols") ? ' cols="' + this.getAttribute("cols") + '"' : ''))
						: this.getAttribute("type") == "password"
							? 'input type="password"'
							: 'input type="text"')+
						' class="xul-textbox--input" name="' + ample.$encodeXMLCharacters(this.getAttribute("name") || '') + '" autocomplete="off" style="width:100%;' + (bMultiline ? 'height:100%;' : '') + 'border:0px solid white;"'+
						' onblur="ample.$instance(this)._onChange(event)" onselectstart="event.cancelBubble=true;"'+
						(!this.$isAccessible() ? ' disabled="true"' : '')+
						(this.getAttribute("readonly") == "true" ? ' readonly="true"' : '')+
						(this.hasAttribute("maxlength") ? ' maxlength="' + this.getAttribute("maxlength") + '"' : '')+
					(bMultiline
						? '>' + (this.hasAttribute("value") ? ample.$encodeXMLCharacters(this.getAttribute("value")) : '') + '</textarea>'
						:(this.hasAttribute("value") ? ' value="' + ample.$encodeXMLCharacters(this.getAttribute("value")) + '"' : '') +' />')+ '\
				</div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_textbox);
