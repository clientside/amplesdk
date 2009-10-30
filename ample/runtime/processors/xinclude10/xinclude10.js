/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var oAMLXInclude10_implementation	= {},
	sAMLXInclude10_namespaceURI		= "http://www.w3.org/2001/XInclude";

// TODO: Consider changing "(a || b) == c" to "c == a || b"
oAMLXInclude10_implementation.traverse	= function(oElementDOM, oNode) {
	if ((oElementDOM.localName || oElementDOM.baseName) == "include") {
		var oHttpRequest	= new cXMLHttpRequest,
			sHref	= oElementDOM.getAttribute("href");
		oHttpRequest.open("GET", sHref, false);
		oHttpRequest.send(null);
		if (oHttpRequest.responseXML && oHttpRequest.responseXML.documentElement && !oHttpRequest.responseXML.getElementsByTagName("parsererror")[0]) {
			oElementDOM	= oHttpRequest.responseXML;
			// set xml:base according to spec
			if (!oElementDOM.documentElement.getAttribute("xml:base"))
				oElementDOM.documentElement.setAttribute("xml:base", sHref);
			return oElementDOM;
		}
		else {
			// lookup if there is fallback
			oElementDOM	= oElementDOM.getElementsByTagName('*')[0];
			if (oElementDOM && (oElementDOM.localName || oElementDOM.baseName).toLowerCase() == "fallback" && oElementDOM.namespaceURI == sAMLXInclude10_namespaceURI)
				if (oElementDOM.childNodes.length)
					return oElementDOM.getElementsByTagName('*')[0] || oElementDOM.childNodes[0];
		}
	}
//->Debug
	else
		fAML_warn(nAML_UNKNOWN_ELEMENT_NS_WRN, [oElementDOM.tagName, oElementDOM.namespaceURI]);
//<-Debug
};

// register processor
oAML_processors[sAMLXInclude10_namespaceURI]	= oAMLXInclude10_implementation;
