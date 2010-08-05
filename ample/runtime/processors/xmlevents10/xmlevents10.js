/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oAMLXMLEvents10_implementation	= {},
	sAMLXMLEvents10_namespaceURI	= "http://www.w3.org/2001/xml-events";

oAMLXMLEvents10_implementation.traverse	= function(oElementDOM, oNode) {
	if ((oElementDOM.localName || oElementDOM.baseName) == "listener") {
		fAMLEventTarget_addEventListener(oNode,
			oElementDOM.getAttribute("event"),
			cFunction("event",	(oElementDOM.getAttribute("propagate") == "stop" ? "event" + ".stopPropagation();" : '') +
								(oElementDOM.getAttribute("defaultAction") == "cancel" ? "event" + ".preventDefault();" : '') +
								(oElementDOM.getAttribute("handler") && oElementDOM.getAttribute("handler").indexOf("javascript" + ':') == 0 ? oElementDOM.getAttribute("handler").substr(cString("javascript" + ':').length) : '')
						),
			oElementDOM.getAttribute("phase") == "capture"
		);
	}
//->Debug
	else {
		fUtilities_warn(sAML_UNKNOWN_ELEMENT_NS_WRN, [oElementDOM.tagName, oElementDOM.namespaceURI]);
	}
//<-Debug
};

// register processor
oAMLImplementation_processors[sAMLXMLEvents10_namespaceURI]	= oAMLXMLEvents10_implementation;
