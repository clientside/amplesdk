/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Query function
var cAMLQuery	= function(){};
cAMLQuery.prototype.length		= 0;
cAMLQuery.prototype.selector	= '';
cAMLQuery.prototype.context		= null;
cAMLQuery.prototype.resolver	= null;

// DOM Element Methods
cAMLQuery.prototype.get	= function(nIndex) {
	// Validate API call
	fGuard(arguments, [
		["index",	cNumber, true]
	]);

	// Invoke implementation
	if (arguments.length)
		return this[nIndex];
	else
		return fAMLQuery_toArray(this);
};

cAMLQuery.prototype.index	= function() {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLQuery.prototype.size	= function() {
	// Validate API call

	// Invoke implementation
	return this.length;
};

function fAMLQuery_toArray(oQuery) {
	var aQuery	= [];
	fAMLQuery_each(oQuery, function() {
		aQuery[aQuery.length]	= this;
	});

	return aQuery;
};

cAMLQuery.prototype.toArray	= function() {
	// Validate API call

	// Invoke implementation
	return fAMLQuery_toArray(this);
};

// Filtering
cAMLQuery.prototype.eq	= function(nIndex) {
	// Validate API call
	fGuard(arguments, [
		["index",	cNumber]
	]);

	// Invoke implementation
	var oQuery	= new cAMLQuery;
	if (nIndex < 0)
		nIndex	= this.length + nIndex;
	if (this[nIndex])
		oQuery[oQuery.length++]	= this[nIndex];
	return oQuery;
};

cAMLQuery.prototype.filter	= function() {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLQuery.prototype.first	= function() {
	var oQuery	= new cAMLQuery;
	if (this.length)
		oQuery[oQuery.length++]	= this[0];
	return oQuery;
};

cAMLQuery.prototype.has	= function() {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLQuery.prototype.is	= function() {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLQuery.prototype.last	= function() {
	var oQuery	= new cAMLQuery;
	if (this.length)
		oQuery[oQuery.length++]	= this[this.length - 1];
	return oQuery;
};

cAMLQuery.prototype.map	= function(fCallback) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLQuery.prototype.not	= function() {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLQuery.prototype.slice	= function(nFirst, nLast) {
	// Validate API call
	fGuard(arguments, [
		["first",	cNumber],
		["last",	cNumber, true]
	]);

	// Invoke implementation
	var oQuery	= new cAMLQuery;
	// TODO: negative values, optional last
	if (nFirst >-1 && nLast < this.length)
		for (var nIndex = nFirst; nIndex < nLast; nIndex++)
			oQuery[oQuery.length++]	= this[nIndex];
	return oQuery;
};

// Enables printing AMLQuery objects in JavaScript consoles (See https://bugs.webkit.org/show_bug.cgi?id=30974 for details)
cAMLQuery.prototype.splice	= function(nFirst, nLength/*vValue1, vValue2,..vValueN*/) {
	// Validate API call
	fGuard(arguments, [
		["first",	cNumber],
		["length",	cNumber, true]
	]);

	// Invoke implementation
	var oQuery	= new cAMLQuery;
	// TODO: negative values, optional length
	if (nFirst >-1 && nFirst + nLength < this.length)
		for (var nIndex = nFirst; nIndex < nFirst + nLength; nIndex++)
			oQuery[oQuery.length++]	= this[nIndex];
	return oQuery;
};

// Collection Manipulation
function fAMLQuery_each(oQuery, fCallback, aArguments) {
	for (var nIndex = 0; nIndex < oQuery.length; nIndex++)
		fCallback.apply(oQuery[nIndex], aArguments || [nIndex, oQuery[nIndex]]);
};

cAMLQuery.prototype.each	= function(fCallback, aArguments) {
	// Validate API call
	fGuard(arguments, [
		["callback",	cFunction],
		["arguments",	cObject, true]
	]);

	// Invoke implementation
	fAMLQuery_each(this, fCallback, aArguments);

	return this;
};