/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_input	= function(){
	this.validity	= new cXHTMLValidityState;
	// Shadow Tree
	this.contentFragment	= ample.createDocumentFragment();
	var that	= this;
	this._spinButtons	= ample.createElement("spinbuttons");
	this._spinButtons.addEventListener("spin", function(oEvent) {
		oEvent.detail ? that.stepUp() : that.stepDown();
	});
	this.contentFragment.appendChild(this._spinButtons);
};
cXHTMLElement_input.prototype	= new cXHTMLInputElement("input");

// Public Properties
cXHTMLElement_input.prototype.value	= "";
cXHTMLElement_input.prototype.checked	= false;

cXHTMLElement_input.prototype.selectionStart	= null;
cXHTMLElement_input.prototype.selectionEnd		= null;

cXHTMLElement_input.prototype.list	= null;
cXHTMLElement_input.prototype.selectedOption	= null;


cXHTMLElement_input.prototype.$isAccessible	= function() {
	return cXHTMLElement.prototype.$isAccessible.call(this) && this.attributes["type"] != "hidden";
};

// Public methods
cXHTMLElement_input.prototype.select	= function() {
	this.$getContainer().select();
};

cXHTMLElement_input.prototype.setSelectionRange	= function() {

};

cXHTMLElement_input.prototype.stepUp	= function() {

};

cXHTMLElement_input.prototype.stepDown	= function() {

};

// Class Events Handlers
cXHTMLElement_input.handlers	= {
	"focus":	function(oEvent) {
		var that	= this;
		setTimeout(function(){try {that.$getContainer("value").focus();that.$getContainer("field").scrollLeft=0;}catch(e){}},0);
		this.$getContainer("placeholder").style.display	= "none";
	},
	"blur":		function(oEvent) {
//		try {this.$getContainer("value").blur();}catch(e){}
		this.$getContainer("placeholder").style.display	= this.attributes.value ? "none" : "";
		// Hide popup
		switch (this.attributes["type"]) {
			case "date":
			case "color":
			case "datetime":
			case "datetime-local":
				cXHTMLElement_input.toggle(this, false);
				break;
		}
	},
	"click":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.$pseudoTarget == this.$getContainer("button")) {
				switch (this.attributes["type"]) {
					case "file":
					case "date":
					case "color":
					case "datetime":
					case "datetime-local":
						this.$activate();
						break;
				}
			}
			else {
				switch (this.attributes["type"]) {
					case "radio":
					case "checkbox":
						this.$activate();
						break;
				}
			}
		}
	},
	"keydown":	function(oEvent) {
		// Handle spin buttons
		if (oEvent.target == this) {
			if (oEvent.keyIdentifier == "U+0020") {	// Space
				switch (this.attributes["type"]) {
					case "checkbox":
//						this.$activate();
						break;
				}
			}
		}
	},
	"keyup":	function(oEvent) {
		// Handle spin buttons
	},
	"DOMActivate":	function(oEvent) {
		if (oEvent.target == this) {
			switch (this.attributes["type"]) {
				case "file":
					this.$getContainer("value").click();
					break;

				case "color":
				case "date":
				case "datetime":
				case "datetime-local":
					cXHTMLElement_input.toggle(this);
					break;

				case "checkbox":
					this.setAttribute("checked", this.getAttribute("checked") == "true" ? "false" : "true");
					break;
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		//
		cXHTMLInputElement.register(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		//
		cXHTMLInputElement.unregister(this);
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "type":
					// Re-render content
					var oElementDOM	= this.$getContainer(),
						oFactory	= document.createElement("div");
					oFactory.innerHTML	= this.$getTag();
					oElementDOM.parentNode.replaceChild(oFactory.firstChild, oElementDOM);
					break;

				case "checked":
					this.$setPseudoClass("checked", oEvent.newValue != null && oEvent.newValue != "false");
			}
			cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
		}
	}
};

// Static Members
cXHTMLElement_input.toggle	= function(oInstance, bForce) {
	// Toggle popup
	var oPopup	= oInstance.$getContainer("popup");
	if ((arguments.length > 1 && bForce == true) || !(arguments.length > 1 || oPopup.style.display != "none")) {
		oInstance.$setPseudoClass("active", true);
		oPopup.style.display	= "";
	}
	else {
		oInstance.$setPseudoClass("active", false);
		oPopup.style.display	= "none";
	}

	switch (oInstance.attributes.type) {
		case "date":
		case "datetime":
		case "datetime-local":
			if (!cXHTMLElement_input.datepicker) {
				var oElement	= oInstance.contentFragment.appendChild(ample.createElement("datepicker"));
				oElement.parentNode	= oInstance;
				oPopup.innerHTML	= oElement.$getTag();
				cXHTMLElement_input.datepicker	= oElement;
			}
			break;

		case "color":
			if (!cXHTMLElement_input.colorpicker) {
				var oElement	= oInstance.contentFragment.appendChild(ample.createElement("colorpicker"));
				oElement.parentNode	= oInstance;
				oPopup.innerHTML	= oElement.$getTag();
				cXHTMLElement_input.colorpicker	= oElement;
			}
			break;
	}
};

cXHTMLElement_input.html524	= {
	"hidden":	"hidden",
	"password":	"password",
	"checkbox":	"checkbox",
	"radio":	"radio",
	"file":		"file",
	"submit":	"submit",
	"image":	"image",
	"reset":	"reset",
	"button":	"button"
};

// Element Render: open
cXHTMLElement_input.prototype.$getTagOpen		= function() {
	var sClassName	=(this.prefix ? this.prefix + '-' : '') + this.localName,
		sClassNameType	= sClassName + '-type-' +(this.attributes["type"] || "text"),
		aHtml	= [];
	aHtml.push('<span class="' + sClassName + ' ' + sClassNameType +
						("class" in this.attributes ? ' ' + this.attributes["class"] : '')+
						' ' + sClassName + '_' + (this.attributes["required"] ? 'required' : 'optional')+ ' '+
						' ' + sClassName + '_' + (this.attributes["disabled"] ? 'disabled' : 'enabled')+ ' '+
						' ' + sClassName + '_' + (this.attributes["readonly"] ? 'read-only' : 'read-write')+ ' '+
						' ' + sClassName + '_' + (cXHTMLInputElement.isValid(this) ? 'valid' : 'invalid')+ ' '+
				'" ' +(this.attributes.style ? ' style="' + this.attributes.style + '"' : '')+ '>');
	aHtml.push(	'<div style="position:absolute;white-space:nowrap;' + (this.getAttribute("value") == '' ? '' : 'display:none')+ '" class="' + sClassName + '--placeholder">' +(this.getAttribute("placeholder") || '')+ '</div>');
	aHtml.push(	'<div class="' + sClassName + '--field ' + sClassNameType + '--field" style="position:relative">');
	aHtml.push(		'<span class="' + sClassName + '--before ' + sClassNameType + '--before" style="float:left"></span>');
	aHtml.push(		'<span class="' + sClassName + '--after ' + sClassNameType + '--after" style="float:right"></span>');
	aHtml.push(		'<span class="' + sClassName + '--button ' + sClassNameType + '--button" style="right:0;">');
	if (this.attributes["type"] == "number" || this.attributes["type"] == "time")
		aHtml.push(this._spinButtons.$getTag());
	aHtml.push('</span>');
	switch (this.attributes["type"]) {
		// Hidden
		// .value
		case "hidden":	// n/a
			break;

		// E-mail
		// @autocomplete, @list, @maxlength, @multiple, @pattern, @placeholder, @readonly, @required, @size
		// .value, .list, .selectedOption, .selectionStart, .selectionEnd
		// select(), setSelectionRange()
		// oninput, onchange
		case "email":	// A text field
			break;

		// Password
		// @autocomplete, @maxlength, @pattern, @placeholder, @readonly, @required, @size
		// .value, .selectionStart, .selectionEnd
		// select(), setSelectionRange()
		// oninput, onchange
		case "password":// Text field that obscures data entry
			break;

		// Date and Time,  Date,  Month,  Week,  Time | Local Date and Time,  Number
		// @autocomplete, @list, @max, @min, @readonly, @required, @step
		// .value, .valueAsDate (not Local Date and Time, Number) .valueAsNumber, .list, .selectedOption
		// .stepDown(), .stepUp()
		// oninput, onchange
		case "datetime":// A date and time control
			break;

		case "date":	// A date control
			break;

		case "month":	// A month control
			break;

		case "week":	// A week control
			break;

		case "time":	// A time control
			break;

		case "datetime-local":	// A date and time control
			break;

		case "number":	// A text field or spinner control
			break;

		// Range
		// @autocomplete, @list, @max, @min, @step
		// .value, .valueAsNumber, .list, .selectedOption
		// .stepDown(), .stepUp()
		// onchange, oninput
		case "range":	// A slider control or similar
			break;

		// Color
		// @autocomplete, @list
		// .value, .list, .selectedOption
		// oninput, onchange
		case "color":	// A color well
			break;

		// Checkbox,  Radio Button
		// @checked, @required
		// .checked, @value (default/on)
		// onchange
		case "checkbox":// A checkbox
		case "radio":	// A radio button
			break;

		// File Upload
		// @accept, @multiple, @required
		// .files, .value
		// onchange
		case "file":	// A label and a button
			break;

		// Submit Button, Image Button
		// @formaction, @formenctype, @formmethod, @formnovalidate, @formtarget
		// .value (default)
		// image: @alt, @src, @height, @width
		case "submit":	// A button
			break;

		case "image":	// Either a clickable image, or a button
			break;

		// Reset Button,  Button
		// @value (default)
		case "reset":	// A button
			break;

		case "button":	// A button
			break;

		// Text,  Search,  URL,  Telephone
		// @autocomplete, @list, @maxlength, @pattern, @placeholder, @readonly, @required, @size
		// .value, .list, .selectedOption, .selectionStart, .selectionEnd
		// select(), setSelectionRange()
		// oninput, onchange
		case "search":	// Search field
			break;

		case "tel":		// A text field
			break;

		case "url":		// A text field
			break;

//		case "text":	// Text field
		default:
			break;
	}
	aHtml.push(		'<input class="' + sClassName + '--value ' + sClassNameType + '--value" \
						type="' +(cXHTMLElement_input.html524[this.attributes.type] || "text")+ '" \
						' + (this.attributes["readonly"] ? 'readonly="true"' : '') + ' \
						' + (this.attributes["disabled"] ? 'disabled="true"' : '') + ' \
						' + (this.attributes["maxlength"] ? 'maxlength="' + this.attributes["maxlength"] + '"' : '') + ' \
						' + (this.attributes["value"] ? 'value="' + this.attributes["value"] + '"' : '') + ' \
						' + (this.attributes.name ? 'name="' + this.attributes.name + '"' : '')+ ' \
					/>');
	aHtml.push(	'</div>');
	aHtml.push(	'<div class="' + sClassName + '--popup" style="position:absolute;display:none">');
    return aHtml.join('');
};

// Element Render: close (cancel double tag)
cXHTMLElement_input.prototype.$getTagClose	= function() {
	var sClassName	=(this.prefix ? this.prefix + '-' : '') + this.localName,
		aHtml	= [];
	aHtml.push(	'</div>');
	aHtml.push('</span>');
	return aHtml.join('');
};

// Register Element
ample.extend(cXHTMLElement_input);
