/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Extend Query

var sAmple_formsXHTMLNS	= "http://www.w3.org/1999/xhtml";

ample.extend(ample.classes.Query.prototype, {
	//
	val:	function(vValue) {
		// validate API
		ample.guard(arguments, [
			["value", Object, true]
		]);

		// Invoke Implementation
		if (argument.length) {
			this.each(function() {
				if (this.namespaceURI == sAmple_formsXHTMLNS &&(this.localName == "input" || this.localName == "textarea" || this.localName == "select" || this.localName == "button"))
					this.setAttribute("value", vValue);
			});
			//
			return this;
		}
		else
		if (this.length)
			return this[0].getAttribute("value");
	},

	//
	blur:	function(fHandler) {
		// validate API
		ample.guard(arguments, [
			["handler", Function, true]
		]);

		// Invoke Implementation
		if (fHandler)
			this.each(function() {
				if (this.namespaceURI == sAmple_formsXHTMLNS &&(this.localName == "input" || this.localName == "textarea" || this.localName == "select" || this.localName == "button"))
					ample.query(this).bind("blur", fHandler);
			});
		else
		if (this.length)
			this[0].blur();
		//
		return this;
	},

	focus:	function(fHandler) {
		// validate API
		ample.guard(arguments, [
			["handler", Function, true]
		]);

		// Invoke Implementation
		if (fHandler)
			this.each(function() {
				if (this.namespaceURI == sAmple_formsXHTMLNS &&(this.localName == "input" || this.localName == "textarea" || this.localName == "select" || this.localName == "button"))
					ample.query(this).bind("focus", fHandler);
			});
		else
		if (this.length)
			this[0].focus();
		//
		return this;
	},

	//
	change:	function(fHandler) {
		// validate API
		ample.guard(arguments, [
			["handler", Function, true]
		]);

		// Invoke Implementation
		if (fHandler)
			this.each(function() {
				if (this.namespaceURI == sAmple_formsXHTMLNS &&(this.localName == "input" || this.localName == "textarea" || this.localName == "select"))
					ample.query(this).bind("change", fHandler);
			});
		else
			throw new ample.classes.DOMException(DOMException.NOT_SUPPORTED_ERR);
		//
		return this;
	},

	select:	function(fHandler) {
		// validate API
		ample.guard(arguments, [
			["handler", Function, true]
		]);

		// Invoke Implementation
		if (fHandler)
			this.each(function() {
				if (this.namespaceURI == sAmple_formsXHTMLNS &&(this.localName == "input" || this.localName == "textarea"))
					ample.query(this).bind("select", fHandler);
			});
		else
		if (this.length)
			this[0].select();
		//
		return this;
	},

	//
	submit:	function(fHandler) {
		// validate API
		ample.guard(arguments, [
			["handler", Function, true]
		]);

		// Invoke Implementation
		if (fHandler)
			this.each(function() {
				if (this.namespaceURI == sAmple_formsXHTMLNS && this.localName == "form")
					ample.query(this).bind("submit", fHandler);
			});
		else
		if (this.length)
			this[0].submit();
		//
		return this;
	},

	reset:	function(fHandler) {
		// validate API
		ample.guard(arguments, [
			["handler", Function, true]
		]);

		// Invoke Implementation
		if (fHandler)
			this.each(function() {
				if (this.namespaceURI == sAmple_formsXHTMLNS && this.localName == "form")
					ample.query(this).bind("reset", fHandler);
			});
		else
		if (this.length)
			this[0].reset();
		//
		return this;
	},

	//
	serialize:	function() {

	},

	serializeArray:	function() {

	}
});
