/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
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
// XML APIs virtual
	cXMLNode		= 0,
	cXMLElement		= 1,
	cXMLDocument	= 9,
//
//	cJSONRequest	= window.JSONRequest,
//	cSoapRequest	= window.SoapRequest,
//
	oJSON			= window.JSON,
//	intervals/timeouts
	fSetTimeout		= window.setTimeout,
	fClearTimeout	= window.clearTimeout,
	fSetInterval	= window.setInterval,
	fClearInterval	= window.clearInterval,
//	misc
	nNaN		= window.NaN,
	fParseInt	= window.parseInt,
	fParseFloat	= window.parseFloat,
	fIsNaN		= window.isNaN,
	fIsFinite	= window.isFinite,
//	window objects
	oUANavigator= window.navigator,
	oUALocation	= window.location,
	oUADocument	= window.document,
// constants
	nInfinity	= window.Infinity;

// Browser detection code
var bTrident	= false,
	bGecko		= false,
	bPresto		= false,
	bWebKit		= false,
/*	bKHTML		= false,*/
	nVersion	= 0;

if (!!oUADocument.namespaces) {
	bTrident	= true;
	nVersion	= oUANavigator.userAgent.match(/MSIE ([\d.]+)/)[1];
}
else
if (!!window.controllers) {
	bGecko		= true;
//	nVersion	= fParseFloat(oUANavigator.userAgent.match(/rv:([\d.]+)/)[1]);
}
else
if (!!window.opera) {
	bPresto		= true;
//	nVersion	= oUANavigator.userAgent.match(/Presto\/([\d.]+)/)[1];
}
else
if (oUANavigator.userAgent.match(/AppleWebKit\/([\d.]+)/)[1]) {
	bWebKit		= true;
}
