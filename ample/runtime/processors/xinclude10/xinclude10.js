/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oAMLXInclude10_implementation	= {},
	sAMLXInclude10_namespaceURI		= "http://www.w3.org/2001/XInclude";

// TODO: Consider changing "(a || b) == c" to "c == a || b"
oAMLXInclude10_implementation.traverse	= function(oElementDOM, oNode) {
	if ((oElementDOM.localName || oElementDOM.baseName) == "include") {
		var oRequest	= new cXMLHttpRequest,
			oDocument,
			sHref	= oElementDOM.getAttribute("href");
		oRequest.open("GET", sHref, false);
		oRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		oRequest.setRequestHeader("X-User-Agent", oAMLConfiguration_values["ample-user-agent"]);
		oRequest.send(null);
		if (oDocument = fBrowser_getResponseDocument(oRequest)) {
			// set xml:base according to spec
			if (!oDocument.documentElement.getAttribute("xml:base"))
				oDocument.documentElement.setAttribute("xml:base", sHref);
			return oDocument;
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
		fUtilities_warn(sAML_UNKNOWN_ELEMENT_NS_WRN, [oElementDOM.tagName, oElementDOM.namespaceURI]);
//<-Debug
};

// register processor
oAMLImplementation_processors[sAMLXInclude10_namespaceURI]	= oAMLXInclude10_implementation;
