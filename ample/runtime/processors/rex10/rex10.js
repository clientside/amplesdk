/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLREX10Implementation	= function(){};
cAMLREX10Implementation.namespaceURI	= "http://www.w3.org/2006/rex";

cAMLREX10Implementation.transmitEvent	= function(oEvent, sUrl)
{

};

cAMLREX10Implementation.getXPath	= function(oNode)
{
	var sXPath	= '';
	for (; oNode; oNode = oNode.parentNode)
	{
		switch (oNode.nodeType)
		{
			case cAMLNode.ELEMENT_NODE:
				if (oNode.hasAttribute("id"))
					return "id" +'("' + oNode.getAttribute("id") + '")' + sXPath;
				else
					sXPath	= "/" + oNode.nodeName +(oNode.parentNode.childNodes.length > 1 && oNode.parentNode.nodeType != cAMLNode.DOCUMENT_NODE ? "[" + oNode.parentNode.childNodes.$indexOf(oNode) + "]" : '')+ sXPath;
				break;

			case cAMLNode.TEXT_NODE:
				sXPath	= '/' + 'text()';
				break;

			case cAMLNode.DOCUMENT_NODE:
				sXPath	= '/' + sXPath;
				break;
		}
	}
	return sXPath;
};

oAML_document.addEventListener("click", function(event){alert(cAMLREX10Implementation.getXPath(event.target))}, false);