/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fAMLExporter_toStringFunction(sName, sOrigin) {
	return cFunction('return "' + "function" + ' ' + sName + '()' + ' ' + '{' + ' ' + '[' + (sOrigin || "ample") + ' ' + "code" + ']' + ' ' + '}"');
};
function fAMLExporter_toStringObject(sName) {
	return cFunction('return "[' + "object" + ' ' + sName + ']"');
};
var fAMLExporter_toString	= fAMLExporter_toStringFunction("toString");
fAMLExporter_toString.toString	= fAMLExporter_toString;
function fAMLExporter_toStringMember(vObject, fToString) {
	if (!vObject.hasOwnProperty("toString")) {
		vObject.toString	= fToString;
		vObject.toString.toString	= fAMLExporter_toString;
	}
};
function fAMLExporter_sign(vObject, sName, sOrigin) {
	fAMLExporter_toStringMember(vObject, (vObject instanceof cFunction ? fAMLExporter_toStringFunction : fAMLExporter_toStringObject)(sName, sOrigin));
	fAMLExporter_signMembers(vObject, sOrigin);
	if (vObject.prototype)
		fAMLExporter_sign(vObject.prototype, sName, sOrigin);
};
function fAMLExporter_signMembers(oObject, sOrigin) {
	// Sign only own members
	for (var sName in oObject)
		if (oObject.hasOwnProperty(sName) && oObject[sName] instanceof cFunction)
			fAMLExporter_toStringMember(oObject[sName], fAMLExporter_toStringFunction(sName, sOrigin));
};

function fAMLExporter_export(cObject, sName, oObject, sOrigin) {
	// Class
	fAMLExporter_sign(cObject, sName, sOrigin);

	// Publish
	(oObject || window)[sName]	= cObject;
};

// publish classes to window
// DOM-Events
fAMLExporter_export(cAMLEvent,				"AMLEvent");
fAMLExporter_export(cAMLCustomEvent,		"AMLCustomEvent");
fAMLExporter_export(cAMLUIEvent,			"AMLUIEvent");
fAMLExporter_export(cAMLTextEvent,			"AMLTextEvent");
fAMLExporter_export(cAMLKeyboardEvent,		"AMLKeyboardEvent");
fAMLExporter_export(cAMLMouseEvent,			"AMLMouseEvent");
fAMLExporter_export(cAMLMouseWheelEvent,	"AMLMouseWheelEvent");
fAMLExporter_export(cAMLMutationEvent,		"AMLMutationEvent");
// Touch/Gesture
fAMLExporter_export(cAMLGestureEvent,		"AMLGestureEvent");
fAMLExporter_export(cAMLTouchEvent,			"AMLTouchEvent");

// DOM-Core
fAMLExporter_export(cAMLStringList,			"AMLStringList");
fAMLExporter_export(cAMLNode,				"AMLNode");
fAMLExporter_export(cAMLAttr,				"AMLAttr");
fAMLExporter_export(cAMLCDATASection,		"AMLCDATASection");
fAMLExporter_export(cAMLCharacterData,		"AMLCharacterData");
fAMLExporter_export(cAMLComment,			"AMLComment");
fAMLExporter_export(cAMLConfiguration,		"AMLConfiguration");
fAMLExporter_export(cAMLDocument,			"AMLDocument");
fAMLExporter_export(cAMLDocumentFragment,	"AMLDocumentFragment");
fAMLExporter_export(cAMLElement, 			"AMLElement");
fAMLExporter_export(cAMLEntityReference,	"AMLEntityReference");
fAMLExporter_export(cAMLException,			"AMLException");
fAMLExporter_export(cAMLError, 				"AMLError");
fAMLExporter_export(cAMLImplementation,		"AMLImplementation");
fAMLExporter_export(cAMLNodeList,			"AMLNodeList");
fAMLExporter_export(cAMLProcessingInstruction,	"AMLProcessingInstruction");
fAMLExporter_export(cAMLText,				"AMLText");
// Touch/Gesture
fAMLExporter_export(cAMLTouch,				"AMLTouch");
fAMLExporter_export(cAMLTouchList,			"AMLTouchList");

// Ample objects
//fAMLExporter_export(cAMLNamespace,		"AMLNamespace");
fAMLExporter_export(cAMLQuery,			"AMLQuery");
//fAMLExporter_export(cAMLSerializer,	"AMLSerializer");
//fAMLExporter_export(cAMLTreeWalker,	"AMLTreeWalker");
//fAMLExporter_export(cAMLWindow,		"AMLWindow");
// Drag&Drop
fAMLExporter_export(cAMLDataTransfer,	"AMLDataTransfer");
fAMLExporter_export(cAMLDragEvent,		"AMLDragEvent");
// Resize
fAMLExporter_export(cAMLResizeEvent,	"AMLResizeEvent");
// History
fAMLExporter_export(cAMLHashChangeEvent,"AMLHashChangeEvent");
// Selectors
fAMLExporter_export(cAMLNodeSelector,	"AMLNodeSelector");
//->Source
//Range
fAMLExporter_export(cAMLRange,			"AMLRange");
//<-Source

// XML Objects
if (!window.DOMParser)
	fAMLExporter_export(cDOMParser,		"DOMParser");
if (!window.XMLSerializer)
	fAMLExporter_export(cXMLSerializer,	"XMLSerializer");
if (!window.XSLTProcessor)
	fAMLExporter_export(cXSLTProcessor,	"XSLTProcessor");
if (bTrident)
	fAMLExporter_export(cXMLHttpRequest,"XMLHttpRequest");
//fAMLExporter_export(cRPCClient,	"RPCClient");
//
//if (!window.JSONRequest)
//	fAMLExporter_export(cJSONRequest,	"JSONRequest");
//if (!window.SoapRequest)
//	fAMLExporter_export(cSoapRequest,	"SoapRequest");
if (!window.JSON)
	fAMLExporter_export(oJSON,	"JSON");

// Special virtual type
fAMLExporter_sign(cArguments,	"Arguments");
// Tweaks and tricks
fAMLExporter_sign(oAmple.prefixes,	"prefixes");
fAMLExporter_sign(oAmple.easing,	"easing");
fAMLExporter_sign(oAmple.locale,	"locale");
fAMLExporter_sign(cAMLNodeSelector.pseudoClass, "pseudoClass");
fAMLExporter_sign(oAmple_root.$getContainer,		"$getContainer");
//
fAMLExporter_export(oAmple,	"ample");

// JavaScript 1.5
if (!cArray.prototype.push)
	fAMLExporter_export(function(vValue) {
		this[this.length]   = vValue;
		return this.length;
	}, "push", cArray.prototype);

if (!cArray.prototype.pop)
	fAMLExporter_export(function() {
		var vValue  = this[this.length-1];
		this.length--;
		return vValue;
	}, "pop", cArray.prototype);

// JavaScript 1.6
//
if (!cArray.prototype.indexOf)
	fAMLExporter_export(function(oElement, nIndex) {
		// Validate arguments
		fGuard(arguments, [
			["element",	cObject, false, true],
			["index",	cNumber, true, false]
		]);

		// adjust nIndex
		var nLength = this.length;
		if (nIndex == null) {
			nIndex = 0;
		} else {
			if (nIndex < 0)
				nIndex = nLength + nIndex;
			if (nIndex < 0)
				nIndex = 0;
		}
		// search
		for (var vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				if (vValue === oElement)
					return nIndex;
		return -1;
	}, "indexOf", cArray.prototype);

if (!cArray.prototype.lastIndexOf)
	fAMLExporter_export(function(oElement, nIndex) {
		// Validate arguments
		fGuard(arguments, [
			["element",	cObject, false, true],
			["index",	cNumber, true, false]
		]);

		// adjust nIndex
		var nLength = this.length;
		if (nIndex == null) {
			nIndex = nLength - 1;
		} else {
			if (nIndex < 0)
				nIndex = nLength + nIndex;
			if (nIndex < 0)
				nIndex = -1;
			else
			if (nIndex >= nLength)
				nIndex = nLength - 1;
		}
		// search
		for (var vValue; nIndex >= 0; nIndex--)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				if (vValue === oElement)
					return nIndex;
		return -1;
	}, "lastIndexOf", cArray.prototype);

//
if (!cArray.prototype.filter)
	fAMLExporter_export(function(fCallback, oReceiver) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);

		for (var nIndex = 0, nLength = this.length, aResult = [], vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				if (fCallback.call(oReceiver, vValue, nIndex, this))
					aResult.push(vValue);
		return aResult;
	}, "filter", cArray.prototype);

if (!cArray.prototype.forEach)
	fAMLExporter_export(function(fCallback, oReceiver) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);

		for (var nIndex = 0, nLength = this.length, vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				fCallback.call(oReceiver, vValue, nIndex, this);
	}, "forEach", cArray.prototype);

if (!cArray.prototype.every)
	fAMLExporter_export(function(fCallback, oReceiver) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);

		for (var nIndex = 0, nLength = this.length, vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				if (!fCallback.call(oReceiver, vValue, nIndex, this))
					return false;
		return true;
	}, "every", cArray.prototype);

if (!cArray.prototype.map)
	fAMLExporter_export(function(fCallback, oReceiver) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);

		for (var nIndex = 0, nLength = this.length, aResult = new cArray(nLength), vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				aResult[nIndex] = fCallback.call(oReceiver, vValue, nIndex, this);
		return aResult;
	}, "map", cArray.prototype);

if (!cArray.prototype.some)
	fAMLExporter_export(function(fCallback, oReceiver) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);

		for (var nIndex = 0, nLength = this.length, vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				if (fCallback.call(oReceiver, vValue, nIndex, this))
					return true;
		return false;
	}, "some", cArray.prototype);

// JavaScript 1.7
// generators, iterators, array comprehensions, let expressions, and destructuring assignment

// JavaScript 1.8
// Expression closures, Generator expressions
if (!cArray.prototype.reduce)
	fAMLExporter_export(function(fCallback/*, initial*/) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction]
		]);

		var nLength = this.length >>> 0,
			nIndex	= 0,
			aValue;

		// no value to return if no initial value and an empty array
		if (nLength == 0 && arguments.length == 1)
			throw new cTypeError;

		if (arguments.length >= 2)
			aValue	= arguments[1];
		else {
			do {
				if (nIndex in this)	{
					aValue = this[nIndex++];
					break;
				}
				// if array contains no values, no initial value to return
				if (++nIndex >= nLength)
					throw new cTypeError;
			}
			while (true);
		}

		for (; nIndex < nLength; nIndex++)
			if (nIndex in this)
				aValue = fCallback.call(null, aValue, this[nIndex], nIndex, this);

		return aValue;
	}, "reduce", cArray.prototype);

if (!cArray.prototype.reduceRight)
	fAMLExporter_export(function(fCallback/*, initial*/) {
		// Validate arguments
		fGuard(arguments, [
			["callback",	cFunction]
		]);

		var nLength = this.length >>> 0,
			nIndex	= nLength - 1,
			aValue;
		// no value to return if no initial value and an empty array
		if (nLength == 0 && arguments.length == 1)
			throw new cTypeError;

		if (arguments.length >= 2)
			aValue	= arguments[1];
		else {
			do {
				if (nIndex in this)	{
					aValue = this[nIndex--];
					break;
				}
				// if array contains no values, no initial value to return
				if (--nIndex < nLength)
					throw new cTypeError;
			}
			while (true);
		}

		for (; nIndex >= 0; nIndex--)
			if (nIndex in this)
				aValue = fCallback.call(null, aValue, this[nIndex], nIndex, this);

		return aValue;
	}, "reduceRight", cArray.prototype);

// JavaScript 1.8.1
// Object.getPrototypeOf(), Native JSON, String methods
if (!cString.prototype.trim)
	fAMLExporter_export(function() {
		return this.replace(/^\s+|\s+$/g, '');
	}, "trim", cString.prototype);

if (!cString.prototype.trimLeft)
	fAMLExporter_export(function(fCallback, oReceiver) {
		return this.replace(/^\s+/, '');
	}, "trimLeft", cString.prototype);

if (!cString.prototype.trimRight)
	fAMLExporter_export(function(fCallback, oReceiver) {
		return this.replace(/\s+$/, '');
	}, "trimRight", cString.prototype);

// JSON
function fJSON_doublizeInteger(n) {
	// Format integers to have at least two digits.
	return n < 10 ? '0' + n : n;
};

if (!cDate.prototype.toJSON)
	fAMLExporter_export(function(sKey) {
		return this.getUTCFullYear()	+ '-' +
			fJSON_doublizeInteger(this.getUTCMonth() + 1)	+ '-' +
			fJSON_doublizeInteger(this.getUTCDate())		+ 'T' +
			fJSON_doublizeInteger(this.getUTCHours())		+ ':' +
			fJSON_doublizeInteger(this.getUTCMinutes())		+ ':' +
			fJSON_doublizeInteger(this.getUTCSeconds())		+ 'Z';
	}, "toJSON", cDate.prototype);

if (!cString.prototype.toJSON)
	fAMLExporter_export(function(sKey) {
		return this.valueOf();
	}, "toJSON", cString.prototype);

if (!cNumber.prototype.toJSON)
	fAMLExporter_export(function(sKey) {
		return this.valueOf();
	}, "toJSON", cNumber.prototype);

if (!cBoolean.prototype.toJSON)
	fAMLExporter_export(function(sKey) {
		return this.valueOf();
	}, "toJSON", cBoolean.prototype);
