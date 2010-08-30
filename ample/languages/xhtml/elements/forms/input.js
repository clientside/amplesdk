/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_input	= function(){};
cXHTMLElement_input.prototype	= new cXHTMLElement("input");
cXHTMLElement_input.prototype.tabIndex	= 0;

// Public Properties
cXHTMLElement_input.prototype.form	= null;
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
		this.$getContainer("value").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("value").blur();
	},
	"DOMNodeInsertedIntoDocument":	function() {
		if (!isNaN(this.getAttribute("tabIndex")))
			this.tabIndex	= this.getAttribute("tabIndex") * 1;
		if (this.hasAttribute("accessKey"))
			this.accessKey	= this.getAttribute("accessKey");
		if (this.attributes["autofocus"])
			this.focus();
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
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
	var sPrefix	= this.prefix ? this.prefix + '-' : '',
		aHtml	= ['<div class="' + sPrefix + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + (this.attributes["required"] ? ' ' + sPrefix + this.localName + '_required' : '')+ '">'];
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
	aHtml.push('<input type="' +(cXHTMLElement_input.html524[this.attributes.type] || "text")+ '" class="input--value input-type-' + this.attributes["type"]+ '" style="border: none;outline:none"/>');
    return aHtml.join('');
};

// Element Render: close (cancel double tag)
cXHTMLElement_input.prototype.$getTagClose	= function() {
	var aHtml	= [];
	aHtml.push('</div>');
	return aHtml.join('');
};

// Register Element
ample.extend(cXHTMLElement_input);
