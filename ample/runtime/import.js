/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
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
//	Microsoft APIs
	fActiveXObject	= window.ActiveXObject,
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
	oNavigator	= window.navigator,
	oLocation	= window.location,
// constants
	nInfinity	= window.Infinity;

