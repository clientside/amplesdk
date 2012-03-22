/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fXHTMLElement_isInputInForm(oElement) {
	return oElement instanceof cXHTMLInputElement && oElement.form;
};

ample.extend(ample.classes.NodeSelector.pseudoClass, {
	"default":		function(oElement) {
		return fXHTMLElement_isInputInForm(oElement)
				&& (oElement.attributes.type == "checkbox" || oElement.attributes.type == "radio")
				&& (oElement.attributes.checked == oElement.defaultChecked);
	},
	"optional":		function(oElement) {
		return fXHTMLElement_isInputInForm(oElement)
				&&!(oElement.attributes["required"] == "" || oElement.attributes["required"] == "true");
	},
	"required":		function(oElement) {
		return fXHTMLElement_isInputInForm(oElement)
				&& (oElement.attributes["required"] == "" || oElement.attributes["required"] == "true");
	},
	"read-write":	function(oElement) {
		return fXHTMLElement_isInputInForm(oElement)
				&&!(oElement.attributes["readonly"] == "" || oElement.attributes["readonly"] == "true");
	},
	"read-only":	function(oElement) {
		return fXHTMLElement_isInputInForm(oElement)
				&& (oElement.attributes["readonly"] == "" || oElement.attributes["readonly"] == "true");
	},
	"invalid":		function(oElement) {
		return fXHTMLElement_isInputInForm(oElement)
				&& oElement.validity &&!oElement.validity.valid;
	},
	"valid":		function(oElement) {
		return fXHTMLElement_isInputInForm(oElement)
				&& oElement.validity && oElement.validity.valid;
	},
	"in-range":		function(oElement) {
		return fXHTMLElement_isInputInForm(oElement)
				&& oElement.validity && !oElement.rangeUnderflow &&!oElement.validity.rangeOverflow;
	},
	"out-of-range":	function(oElement) {
		return fXHTMLElement_isInputInForm(oElement)
				&& oElement.validity && (oElement.rangeUnderflow || oElement.validity.rangeOverflow);
	}
});