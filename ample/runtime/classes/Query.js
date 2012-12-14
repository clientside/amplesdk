/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Query function
var cQuery	= function(vItem) {
	if (arguments.length) {
		var oQuery	= this;
		cArray.isArray(vItem) ? vItem.forEach(function(vItem) {
			oQuery[oQuery.length++]	= vItem;
		}) : oQuery[oQuery.length++]	= vItem;
	}
};

cQuery.prototype.length		= 0;
cQuery.prototype.selector	= '';
cQuery.prototype.context	= null;
cQuery.prototype.resolver	= null;

// DOM Element Methods
cQuery.prototype.get	= function(nIndex) {
//->Guard
	fGuard(arguments, [
		["index",	cNumber, true]
	]);
//<-Guard

	if (arguments.length)
		return this[nIndex];
	else
		return fQuery_toArray(this);
};

cQuery.prototype.index	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.size	= function() {
	return this.length;
};

function fQuery_toArray(oQuery) {
	var aQuery	= [];
	fQuery_each(oQuery, function() {
		aQuery[aQuery.length]	= this;
	});

	return aQuery;
};

cQuery.prototype.toArray	= function() {
	return fQuery_toArray(this);
};

// Filtering
cQuery.prototype.eq	= function(nIndex) {
//->Guard
	fGuard(arguments, [
		["index",	cNumber]
	]);
//<-Guard

	var oQuery	= new cQuery;
	if (nIndex < 0)
		nIndex	= this.length + nIndex;
	if (this[nIndex])
		oQuery[oQuery.length++]	= this[nIndex];
	return oQuery;
};

cQuery.prototype.filter	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.first	= function() {
	var oQuery	= new cQuery;
	if (this.length)
		oQuery[oQuery.length++]	= this[0];
	return oQuery;
};

cQuery.prototype.has	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.is	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.last	= function() {
	var oQuery	= new cQuery;
	if (this.length)
		oQuery[oQuery.length++]	= this[this.length - 1];
	return oQuery;
};

cQuery.prototype.map	= function(fCallback) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.not	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.slice	= function(nFirst, nLast) {
//->Guard
	fGuard(arguments, [
		["first",	cNumber],
		["last",	cNumber, true]
	]);
//<-Guard

	var nLength	= this.length;
	if (nFirst < 0)
		nFirst	+= nLength;
	// If last omitted
	if (arguments.length < 2)
		nLast	= nLength;
	else
	if (nLast < 0)
		nLast	+= nLength;

	var oQuery	= new cQuery;
	if (nFirst >-1 && nLast < nLength + 1)
		for (var nIndex = nFirst; nIndex < nLast; nIndex++)
			oQuery[oQuery.length++]	= this[nIndex];
	return oQuery;
};

// Enables printing Query objects in JavaScript consoles (See https://bugs.webkit.org/show_bug.cgi?id=30974 for details)
cQuery.prototype.splice	= function(nFirst, nLength/*vValue1, vValue2,..vValueN*/) {
//->Guard
	fGuard(arguments, [
		["first",	cNumber],
		["length",	cNumber, true]
	]);
//<-Guard

	var oQuery	= new cQuery;
	// TODO: negative values, optional length
	if (nFirst >-1 && nFirst + nLength < this.length)
		for (var nIndex = nFirst; nIndex < nFirst + nLength; nIndex++)
			oQuery[oQuery.length++]	= this[nIndex];
	return oQuery;
};

// Collection Manipulation
function fQuery_each(oQuery, fCallback, aArguments) {
	for (var nIndex = 0; nIndex < oQuery.length; nIndex++)
		fCallback.apply(oQuery[nIndex], aArguments || [nIndex, oQuery[nIndex]]);
	//
	return oQuery;
};

cQuery.prototype.each	= function(fCallback, aArguments) {
//->Guard
	fGuard(arguments, [
		["callback",	cFunction],
		["arguments",	cObject, true]
	]);
//<-Guard

	return fQuery_each(this, fCallback, aArguments);
};