/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLInputElement	= function() {
	cXHTMLElement.apply(this, arguments);
};

cXHTMLInputElement.prototype	= new cXHTMLElement("#element-input");

// Accessibility
cXHTMLInputElement.prototype.tabIndex	= 0;

//
cXHTMLInputElement.prototype.form	= null;

// Validation
cXHTMLInputElement.prototype.validity		= null;
cXHTMLInputElement.prototype.willValidate	= true;
cXHTMLInputElement.prototype.checkValidity	= function() {

};
cXHTMLInputElement.prototype.validationMessage	= "";
cXHTMLInputElement.prototype.setCustomValidty	= function(sMessage) {

};

// Register Element
ample.extend(cXHTMLInputElement);