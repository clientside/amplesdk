/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_body	= function(){};
cXHTMLElement_body.prototype	= new cXHTMLElement;
cXHTMLElement_body.prototype.tabIndex	= 0;
/*
cXHTMLElement_body.prototype.$getTag	= function()
{
	var aHtml	= [];
	for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
		aHtml[aHtml.length]	= this.childNodes[nIndex].$getTag();
	return aHtml.join('');
};
*/
// Register Element with language
oXHTMLNamespace.setElement("body", cXHTMLElement_body);
