/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cXPathParser() {

};

function fXPathParser_parse(sExpression, nColumn, nLine) {
	var oTokenizer	= new cXPathTokenizer(sExpression);
	var oParent	= new cXPathToken(cXPathToken.XPath, null, nColumn, nLine);

	fXPathParser_parseTree(oParent, oTokenizer);

	return oParent;
};

function fXPathParser_parseTree(oParent, oTokenizer) {

};