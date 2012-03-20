/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
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
		if (this.attributes["type"] == "number") {
			if (oEvent.keyIdentifier == "Up" || oEvent.keyIdentifier == "Down")
				this.spinButtons.spin(oEvent.keyIdentifier == "Up");
		}
	},
	"keyup":	function(oEvent) {
    	this.attributes["value"]	= this.$getContainer("input").value;
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "value":
					this.$getContainer("placeholder").style.display	= oEvent.newValue ? "none" : '';
					this.$getContainer("input").value    = oEvent.newValue || '';
					break;

				case "disabled":
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					this.$getContainer("input").disabled = oEvent.newValue == "true";
					if (this.attributes["type"] == "number")
						this.spinButtons.setAttribute("disabled", oEvent.newValue == "true" ? "true" : "false");
					break;

				case "readonly":
					this.$getContainer("input").readOnly	= oEvent.newValue == "true";
					break;

				case "type":
					// TODO
					break;

				case "multiline":
					// TODO
					break;

				case "maxlength":
					break;

				case "rows":
					if (this.attributes["multiline"] == "true")
						this.$getContainer("input").rows	= oEvent.newValue;
					break;

				case "cols":
					if (this.attributes["multiline"] == "true")
						this.$getContainer("input").cols	= oEvent.newValue;
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.spinButtons.setAttribute("disabled", this.$isAccessible() ? "false" : "true");
	}
};

cXULElement_textbox.prototype._onChange  = function(oEvent) {
    // Fire Event
	cXULInputElement.dispatchChange(this);
};

// Element Render: open
cXULElement_textbox.prototype.$getTagOpen	= function(oElement) {
	var bMultiline	= this.attributes["multiline"] == "true";
	if (this.attributes["type"] == "number" && this.attributes["disabled"] == "true")
		this.spinButtons.setAttribute("disabled", "true");
    return	'<div class="xul-textbox' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + (bMultiline ? ' xul-textbox-multiline-true' : '') + " xul-textbox-type-" + (this.attributes["type"] || '') + (!this.$isAccessible() ? " xul-textbox_disabled" : '')+ '" style="'+
				(this.attributes["height"] ? 'height:' + this.attributes["height"] + ';' : '')+
				(this.attributes["width"] ? 'width:' + this.attributes["width"] + ';' : '')+
				(this.attributes["style"] ? this.attributes["style"] : '')+'">\
				<div class="xul-textbox--placeholder" style="position:absolute;' + (this.getAttribute("value") == '' ? '' : 'display:none')+ '" onmousedown="var o = ample.$instance(this); setTimeout(function(){o.$getContainer(\'input\').focus();o.$getContainer(\'input\').select()}, 0)">' + this.getAttribute("placeholder") + '</div>\
				<div class="xul-textbox--field">\
					' + (this.attributes["type"] == "number" ? this.spinButtons.$getTag() : this.attributes["type"] == "search" ? '<div class="xul-textbox--button" onmousedown="return false"></div>' : '')+ '\
					<' +
					(bMultiline
						?("textarea" + (this.attributes["rows"] ? ' rows="' + this.attributes["rows"] + '"' : '')+(this.attributes["cols"] ? ' cols="' + this.attributes["cols"] + '"' : ''))
						: this.attributes["type"] == "password"
							? 'input type="password"'
							: 'input type="text"')+
						' class="xul-textbox--input" name="' + this.attributes["name"] + '" autocomplete="off" style="width:100%;' + (bMultiline ? 'height:100%;' : '') + 'border:0px solid white;"'+
						' onblur="ample.$instance(this)._onChange(event)" onselectstart="event.cancelBubble=true;"'+
						(!this.$isAccessible() ? ' disabled="true"' : '')+
						(this.attributes["readonly"] == "true" ? ' readonly="true"' : '')+
						(this.hasAttribute("maxlength") ? ' maxlength="' + this.getAttribute("maxlength") + '"' : '')+
					(bMultiline
						? '>' + this.attributes["value"] + '</textarea>'
						: ' value="' + this.attributes["value"] + '" />')+ '\
				</div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_textbox);
