/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//	Javascript objects
var cString		= window.String,
	cBoolean	= window.Boolean,
	cNumber		= window.Number,
	cObject		= window.Object,
	cArray		= window.Array,
	cRegExp		= window.RegExp,
	cDate		= window.Date,
	cFunction	= window.Function,
	cMath		= window.Math,
	cArguments	= function(){},
// Error Objects
	cError		= window.Error,
	cSyntaxError= window.SyntaxError,
	cTypeError	= window.TypeError,
//	Microsoft APIs
	cActiveXObject	= window.ActiveXObject,
//	XML APIs
	cXMLHttpRequest	= window.XMLHttpRequest,
	cDOMParser		= window.DOMParser,
	cXMLSerializer	= window.XMLSerializer,
	cXSLTProcessor	= window.XSLTProcessor,
//	JSON API
	oJSON			= window.JSON,
//	XML APIs virtual
	cXMLNode		= function(){},
	cXMLElement		= function(){},
	cXMLDocument	= function(){},
//	intervals/timeouts
	fSetTimeout		= window.setTimeout,
	fClearTimeout	= window.clearTimeout,
//	fSetInterval	= window.setInterval,
//	fClearInterval	= window.clearInterval,
//	misc
	fParseInt	= window.parseInt,
	fParseFloat	= window.parseFloat,
	fIsNaN		= window.isNaN,
	fIsFinite	= window.isFinite,
	fEval		= window.eval,
	fEncodeURIComponent	= window.encodeURIComponent,
//	window objects
	oUANavigator= window.navigator,
	oUALocation	= window.location,
	oUADocument	= window.document,
//
	fGlobal		= arguments.callee,
//
//	oUALocalStorage		= window.localStorage,
//	oUASessionStorage	= window.sessionStorage,
// constants
	nNaN		= window.NaN,
	nInfinity	= window.Infinity,
// namespaces
	sNS_SVG		= "http://www.w3.org/2000/svg",
	sNS_AML		= "http://www.amplesdk.com/ns/aml",
	sNS_XUL		= "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
	sNS_XHTML	= "http://www.w3.org/1999/xhtml",
	sNS_XLINK	= "http://www.w3.org/1999/xlink",
	sNS_SMIL	= "http://www.w3.org/2008/SMIL30/",
	sNS_XEVENTS	= "http://www.w3.org/2001/xml-events",
	sNS_XSLT	= "http://www.w3.org/1999/XSL/Transform",
	sNS_XML		= "http://www.w3.org/XML/1998/namespace",
	sNS_XMLNS	= "http://www.w3.org/2000/xmlns/",
	sNS_XINCLUDE= "http://www.w3.org/2001/XInclude";

// Browser detection code
var aUserAgent	= oUANavigator.userAgent.match(/(MSIE|rv\:|AppleWebKit|Presto)(?:[\/\s])?(\d+\.\d+)/),
	bTrident	= false,
	bGecko		= false,
	bPresto		= false,
	bWebKit		= false,
	nVersion	= 0;

if (!!oUADocument.namespaces) {
	bTrident	= true;
	nVersion	= 1 * aUserAgent[2];
}
else
if (!!window.controllers) {
	bGecko		= true;
	nVersion	= 1 * aUserAgent[2];
}
else
if (!!window.opera) {
	bPresto		= true;
	nVersion	= 1 * aUserAgent[2];
}
else
if (aUserAgent) {
	if (aUserAgent[1] == "MSIE") {
		bTrident	= true;
		nVersion	= 1 * aUserAgent[2];
	}
	else
	if (aUserAgent[1] == "AppleWebKit") {
		bWebKit		= true;
		nVersion	= 1 * aUserAgent[2];
	}
}

