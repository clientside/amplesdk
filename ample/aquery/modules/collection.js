/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */


// Collection
aQuery.extend("get", function(nIndex) {
	// Validate API call
	aQuery.guard(arguments, [
		["index",	window.Number]
	]);

	// Invoke implementation
	return this[nIndex];
});

aQuery.extend("first",	function() {
	var oQuery	= new aQuery;
	if (this.length)
		oQuery[oQuery.length++]	= this[0];
	return oQuery;
});

aQuery.extend("last",	function() {
	var oQuery	= new aQuery;
	if (this.length)
		oQuery[aQuery.length++]	= this[this.length - 1];
	return oQuery;
});

aQuery.extend("slice",	function(nFirst, nLast) {
	// Validate API call
	aQuery.guard(arguments, [
		["first",	window.Number],
		["last",	window.Number, true]
	]);

	// Invoke implementation
	var oQuery	= new aQuery;
	// TODO: negative values, optional last
	if (nFirst >-1 && nLast < this.length)
		for (var nIndex = nFirst; nIndex < nLast; nIndex++)
			oQuery[oQuery.length++]	= this[nIndex];
	return oQuery;
});

aQuery.extend("each",	function(fCallback, aArguments) {
	// Validate API call
	aQuery.guard(arguments, [
		["callback",	window.Function],
		["arguments",	window.Object, true]
	]);

	// Invoke implementation
	aQuery.each(this, fCallback, aArguments);
});