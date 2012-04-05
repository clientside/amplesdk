/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */


// JavaScript 1.5
if (!cArray.prototype.push)
	fExporter_export(function(vValue) {
		this[this.length]	= vValue;
		return this.length;
	}, "push", cArray.prototype);

if (!cArray.prototype.pop)
	fExporter_export(function() {
		var vValue	= this[this.length-1];
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
		var nLength	= this.length;
		if (nIndex == null) {
			nIndex	= 0;
		} else {
			if (nIndex < 0)
				nIndex	= nLength + nIndex;
			if (nIndex < 0)
				nIndex	= 0;
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
		var nLength	= this.length;
		if (nIndex == null) {
			nIndex	= nLength - 1;
		} else {
			if (nIndex < 0)
				nIndex	= nLength + nIndex;
			if (nIndex < 0)
				nIndex	= -1;
			else
			if (nIndex >= nLength)
				nIndex	= nLength - 1;
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
				aResult[nIndex]	= fCallback.call(oReceiver, vValue, nIndex, this);
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

//JavaScript 1.8
//Expression closures, Generator expressions
if (!cArray.prototype.reduce)
	fExporter_export(function(fCallback/*, initial*/) {
//->Guard
		fGuard(arguments, [
			["callback",	cFunction]
		]);
//<-Guard

		var nLength	= this.length >>> 0,
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
					aValue	= this[nIndex++];
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
				aValue	= fCallback.call(null, aValue, this[nIndex], nIndex, this);

		return aValue;
	}, "reduce", cArray.prototype);

if (!cArray.prototype.reduceRight)
	fExporter_export(function(fCallback/*, initial*/) {
//->Guard
		fGuard(arguments, [
			["callback",	cFunction]
		]);
//<-Guard

		var nLength	= this.length >>> 0,
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
					aValue	= this[nIndex--];
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
				aValue	= fCallback.call(null, aValue, this[nIndex], nIndex, this);

		return aValue;
	}, "reduceRight", cArray.prototype);

// JavaScript 1.8.5
if (!cArray.isArray)
	fExporter_export(function(oObject) {
//->Guard
		fGuard(arguments, [
			["object",	cObject]
		]);
//<-Guard
		return cObject.prototype.toString.call(oObject) == '[' + "object" + ' ' + "Array" + ']';
	}, "isArray", cArray);
