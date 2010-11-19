/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oAMLQuery_cache	= {};

function fAMLQuery_data(oQuery, sName, oValue) {
	if (typeof oValue != "undefined") {
		fAMLQuery_each(oQuery, function() {
			var oCache	= oAMLQuery_cache[this.uniqueID];
			if (!oCache)
				oCache	= oAMLQuery_cache[this.uniqueID] = {};
			if (oValue == null)
				delete oCache[sName];
			else
				oCache[sName]	= oValue;
		});
		return oQuery;
	}
	else
	if (oQuery.length) {
		var oElement= oQuery[0],
			oCache	= oAMLQuery_cache[oElement.uniqueID];
		if (!oCache)
			oCache	= oAMLQuery_cache[oElement.uniqueID] = {};
		if (typeof sName != "undefined")
			return oCache[sName];
		else
			return oCache;
	}
};

cAMLQuery.prototype.data	= function(sName, oValue) {
//->Guard
	fGuard(arguments, [
		["name",	cString, true],
		["value",	cObject, true, true]
	]);
//<-Guard

	return fAMLQuery_data(this, sName, oValue);
};

oAmple.data	= function(oElement, sName, oValue) {
//->Guard
	fGuard(arguments, [
		["element",	cAMLElement],
		["name",	cString, true],
		["value",	cObject, true, true]
	]);
//<-Guard

	var oQuery	= new cAMLQuery;
	oQuery[oQuery.length++]	= oElement;
	return fAMLQuery_data(oQuery, sName, oValue);
};