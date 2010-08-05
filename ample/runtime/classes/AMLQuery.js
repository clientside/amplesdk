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

function fAMLQuery_each(oQuery, fCallback, aArguments) {
	for (var nIndex = 0; nIndex < oQuery.length; nIndex++)
		fCallback.apply(oQuery[nIndex], aArguments || [nIndex, oQuery[nIndex]]);
};