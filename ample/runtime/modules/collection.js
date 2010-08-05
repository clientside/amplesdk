/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */


// Collection
cAMLQuery.prototype.get	= function(nIndex) {
	// Validate API call
	fGuard(arguments, [
		["index",	cNumber]
	]);

	// Invoke implementation
	return this[nIndex];
};

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

cAMLQuery.prototype.first	= function() {
	var oQuery	= new cAMLQuery;
	if (this.length)
		oQuery[oQuery.length++]	= this[0];
	return oQuery;
};

cAMLQuery.prototype.last	= function() {
	var oQuery	= new cAMLQuery;
	if (this.length)
		oQuery[oAmple.length++]	= this[this.length - 1];
	return oQuery;
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

cAMLQuery.prototype.each	= function(fCallback, aArguments) {
	// Validate API call
	fGuard(arguments, [
		["callback",	cFunction],
		["arguments",	cObject, true]
	]);

	// Invoke implementation
	fAMLQuery_each(this, fCallback, aArguments);
};