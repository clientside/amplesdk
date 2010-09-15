/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oXHTMLPseudoClassSelector	= new AMLCSSPseudoClassSelector;
oXHTMLPseudoClassSelector["default"]	= function(oElement) {
	return fXHTMLElement_isInputInForm(oElement)
			&& (oElement.attributes.type == "checkbox" || oElement.attributes.type == "radio")
			&& (oElement.attributes.checked == oElement.defaultChecked);
};
oXHTMLPseudoClassSelector["optional"]	= function(oElement) {
	return fXHTMLElement_isInputInForm(oElement)
			&&!(oElement.attributes["required"] == "" || oElement.attributes["required"] == "true");
};
oXHTMLPseudoClassSelector["required"]	= function(oElement) {
	return fXHTMLElement_isInputInForm(oElement)
			&& (oElement.attributes["required"] == "" || oElement.attributes["required"] == "true");
};
oXHTMLPseudoClassSelector["read-write"]	= function(oElement) {
	return fXHTMLElement_isInputInForm(oElement)
			&&!(oElement.attributes["readonly"] == "" || oElement.attributes["readonly"] == "true");
};
oXHTMLPseudoClassSelector["read-only"]	= function(oElement) {
	return fXHTMLElement_isInputInForm(oElement)
			&& (oElement.attributes["readonly"] == "" || oElement.attributes["readonly"] == "true");
};
oXHTMLPseudoClassSelector["invalid"]	= function(oElement) {
	return fXHTMLElement_isInputInForm(oElement)
			&& oElement.validity &&!oElement.validity.valid;
};
oXHTMLPseudoClassSelector["valid"]	= function(oElement) {
	return fXHTMLElement_isInputInForm(oElement)
			&& oElement.validity && oElement.validity.valid;
};
oXHTMLPseudoClassSelector["in-range"]	= function(oElement) {
	return fXHTMLElement_isInputInForm(oElement)
			&& oElement.validity && !oElement.rangeUnderflow &&!oElement.validity.rangeOverflow;
};
oXHTMLPseudoClassSelector["out-of-range"]	= function(oElement) {
	return fXHTMLElement_isInputInForm(oElement)
			&& oElement.validity && (oElement.rangeUnderflow || oElement.validity.rangeOverflow);
};

function fXHTMLElement_isInputInForm(oElement) {
	return oElement instanceof cXHTMLInputElement && oElement.form;
};

ample.extend(oXHTMLPseudoClassSelector);