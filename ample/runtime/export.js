/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fExporter_toStringFunction(sName, sOrigin) {
	return cFunction('return "' + "function" + ' ' + sName + '()' + ' ' + '{' + ' ' + '[' + (sOrigin || "ample") + ' ' + "code" + ']' + ' ' + '}"');
};
function fExporter_toStringObject(sName) {
	return cFunction('return "[' + "object" + ' ' + sName + ']"');
};
var fExporter_toString	= fExporter_toStringFunction("toString");
fExporter_toString.toString	= fExporter_toString;
function fExporter_toStringMember(vObject, fToString) {
	if (!vObject.hasOwnProperty("toString")) {
		vObject.toString	= fToString;
		vObject.toString.toString	= fExporter_toString;
	}
};
function fExporter_sign(vObject, sName, sOrigin) {
	fExporter_toStringMember(vObject, (vObject instanceof cFunction ? fExporter_toStringFunction : fExporter_toStringObject)(sName, sOrigin));
	fExporter_signMembers(vObject, sOrigin);
	if (vObject.prototype)
		fExporter_sign(vObject.prototype, sName, sOrigin);
};
function fExporter_signMembers(oObject, sOrigin) {
	// Sign only own members
	for (var sName in oObject)
		if (oObject.hasOwnProperty(sName) && oObject[sName] instanceof cFunction)
			fExporter_toStringMember(oObject[sName], fExporter_toStringFunction(sName, sOrigin));
};

function fExporter_export(cObject, sName, oObject, sOrigin) {
	// Class
	fExporter_sign(cObject, sName, sOrigin);

	// Publish
	(oObject || hClasses)[sName]	= cObject;
};

// publish classes to window
// DOM-Events
fExporter_export(cEvent,			"Event");
fExporter_export(cCustomEvent,		"CustomEvent");
fExporter_export(cUIEvent,			"UIEvent");
fExporter_export(cTextEvent,		"TextEvent");
fExporter_export(cKeyboardEvent,	"KeyboardEvent");
fExporter_export(cMouseEvent,		"MouseEvent");
fExporter_export(cMouseWheelEvent,	"MouseWheelEvent");
fExporter_export(cMutationEvent,	"MutationEvent");
// Touch/Gesture
fExporter_export(cGestureEvent,		"GestureEvent");
fExporter_export(cTouchEvent,		"TouchEvent");

// DOM-Core
fExporter_export(cDOMStringList,	"DOMStringList");
fExporter_export(cNode,				"Node");
fExporter_export(cAttr,				"Attr");
fExporter_export(cCDATASection,		"CDATASection");
fExporter_export(cCharacterData,	"CharacterData");
fExporter_export(cComment,			"Comment");
fExporter_export(cDOMConfiguration,	"DOMConfiguration");
fExporter_export(cDocument,			"Document");
fExporter_export(cDocumentFragment,	"DocumentFragment");
fExporter_export(cElement, 			"Element");
fExporter_export(cEntityReference,	"EntityReference");
fExporter_export(cDOMException,		"DOMException");
fExporter_export(cDOMError, 		"DOMError");
fExporter_export(cDOMImplementation,"DOMImplementation");
fExporter_export(cNodeList,			"NodeList");
fExporter_export(cProcessingInstruction,	"ProcessingInstruction");
fExporter_export(cText,				"Text");
// Touch/Gesture
fExporter_export(cTouch,			"Touch");
fExporter_export(cTouchList,		"TouchList");
// Drag&Drop
fExporter_export(cDataTransfer,		"DataTransfer");
fExporter_export(cDragEvent,		"DragEvent");
// Resize
fExporter_export(cResizeEvent,		"ResizeEvent");
// History
fExporter_export(cHashChangeEvent,	"HashChangeEvent");
// Selectors
fExporter_export(cNodeSelector,		"NodeSelector");
// Ample SDK objects
fExporter_export(cQuery,			"Query");

//->Source
//Range
fExporter_export(cRange,			"Range");
//<-Source

// XML Objects
if (!window.DOMParser)
	fExporter_export(cDOMParser,		"DOMParser",		window);
if (!window.XMLSerializer)
	fExporter_export(cXMLSerializer,	"XMLSerializer",	window);
if (!window.XSLTProcessor)
	fExporter_export(cXSLTProcessor,	"XSLTProcessor",	window);
if (bTrident)
	fExporter_export(cXMLHttpRequest,	"XMLHttpRequest",	window);
if (!window.JSON)
	fExporter_export(oJSON,	"JSON",	window);

// Special virtual type
fExporter_sign(cArguments,	"Arguments");
// Tweaks and tricks
fExporter_sign(oAmple.prefixes,	"prefixes");
fExporter_sign(oAmple.classes,	"classes");
fExporter_sign(oAmple.easing,	"easing");
fExporter_sign(oAmple.locale,	"locale");
fExporter_sign(cNodeSelector.pseudoClass,	"pseudoClass");
fExporter_sign(oAmple_root.$getContainer,	"$getContainer");
//
fExporter_export(oAmple,	"ample", window);

// JavaScript 1.5
if (!cArray.prototype.push)
	fExporter_export(function(vValue) {
		this[this.length]   = vValue;
		return this.length;
	}, "push", cArray.prototype);

if (!cArray.prototype.pop)
	fExporter_export(function() {
		var vValue  = this[this.length-1];
		this.length--;
		return vValue;
	}, "pop", cArray.prototype);

// JavaScript 1.6
//
if (!cArray.prototype.indexOf)
	fExporter_export(function(oElement, nIndex) {
//->Guard
		fGuard(arguments, [
			["element",	cObject, false, true],
			["index",	cNumber, true, false]
		]);
//<-Guard
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
	fExporter_export(function(oElement, nIndex) {
//->Guard
		fGuard(arguments, [
			["element",	cObject, false, true],
			["index",	cNumber, true, false]
		]);
//<-Guard
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
	fExporter_export(function(fCallback, oReceiver) {
//->Guard
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);
//<-Guard

		for (var nIndex = 0, nLength = this.length, aResult = [], vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				if (fCallback.call(oReceiver, vValue, nIndex, this))
					aResult.push(vValue);
		return aResult;
	}, "filter", cArray.prototype);

if (!cArray.prototype.forEach)
	fExporter_export(function(fCallback, oReceiver) {
//->Guard
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);
//<-Guard

		for (var nIndex = 0, nLength = this.length, vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				fCallback.call(oReceiver, vValue, nIndex, this);
	}, "forEach", cArray.prototype);

if (!cArray.prototype.every)
	fExporter_export(function(fCallback, oReceiver) {
//->Guard
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);
//<-Guard

		for (var nIndex = 0, nLength = this.length, vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				if (!fCallback.call(oReceiver, vValue, nIndex, this))
					return false;
		return true;
	}, "every", cArray.prototype);

if (!cArray.prototype.map)
	fExporter_export(function(fCallback, oReceiver) {
//->Guard
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);
//<-Guard

		for (var nIndex = 0, nLength = this.length, aResult = new cArray(nLength), vValue; nIndex < nLength; nIndex++)
			if (!(typeof(vValue = this[nIndex]) == "undefined") || nIndex in this)
				aResult[nIndex] = fCallback.call(oReceiver, vValue, nIndex, this);
		return aResult;
	}, "map", cArray.prototype);

if (!cArray.prototype.some)
	fExporter_export(function(fCallback, oReceiver) {
//->Guard
		fGuard(arguments, [
			["callback",	cFunction],
			["receiver",	cObject, true, true]
		]);
//<-Guard

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
	fExporter_export(function(fCallback/*, initial*/) {
//->Guard
		fGuard(arguments, [
			["callback",	cFunction]
		]);
//<-Guard

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
	fExporter_export(function(fCallback/*, initial*/) {
//->Guard
		fGuard(arguments, [
			["callback",	cFunction]
		]);
//<-Guard

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
	fExporter_export(function() {
		return this.replace(/^\s+|\s+$/g, '');
	}, "trim", cString.prototype);

if (!cString.prototype.trimLeft)
	fExporter_export(function(fCallback, oReceiver) {
		return this.replace(/^\s+/, '');
	}, "trimLeft", cString.prototype);

if (!cString.prototype.trimRight)
	fExporter_export(function(fCallback, oReceiver) {
		return this.replace(/\s+$/, '');
	}, "trimRight", cString.prototype);

// JSON
function fJSON_doublizeInteger(n) {
	// Format integers to have at least two digits.
	return n < 10 ? '0' + n : n;
};

if (!cDate.prototype.toJSON)
	fExporter_export(function(sKey) {
		return this.getUTCFullYear()	+ '-' +
			fJSON_doublizeInteger(this.getUTCMonth() + 1)	+ '-' +
			fJSON_doublizeInteger(this.getUTCDate())		+ 'T' +
			fJSON_doublizeInteger(this.getUTCHours())		+ ':' +
			fJSON_doublizeInteger(this.getUTCMinutes())		+ ':' +
			fJSON_doublizeInteger(this.getUTCSeconds())		+ 'Z';
	}, "toJSON", cDate.prototype);

if (!cString.prototype.toJSON)
	fExporter_export(function(sKey) {
		return this.valueOf();
	}, "toJSON", cString.prototype);

if (!cNumber.prototype.toJSON)
	fExporter_export(function(sKey) {
		return this.valueOf();
	}, "toJSON", cNumber.prototype);

if (!cBoolean.prototype.toJSON)
	fExporter_export(function(sKey) {
		return this.valueOf();
	}, "toJSON", cBoolean.prototype);
