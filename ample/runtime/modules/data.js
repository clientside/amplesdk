/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oQuery_cache	= {};

function fQuery_data(oQuery, sName, oValue) {
	if (typeof oValue != "undefined") {
		return fQuery_each(oQuery, function() {
			var oCache	= oQuery_cache[this.uniqueID];
			if (!oCache)
				oCache	= oQuery_cache[this.uniqueID]	= {};
			if (oValue == null)
				delete oCache[sName];
			else
				oCache[sName]	= oValue;
		});
	}
	else
	if (oQuery.length) {
		var oElement= oQuery[0],
			oCache	= oQuery_cache[oElement.uniqueID];
		if (!oCache)
			oCache	= oQuery_cache[oElement.uniqueID]	= {};
		if (typeof sName != "undefined")
			return oCache[sName];
		else
			return oCache;
	}
};

cQuery.prototype.data	= function(sName, oValue) {
//->Guard
	fGuard(arguments, [
		["name",	cString, true],
		["value",	cObject, true, true]
	]);
//<-Guard

	return fQuery_data(this, sName, oValue);
};

oAmple.data	= function(oElement, sName, oValue) {
//->Guard
	fGuard(arguments, [
		["element",	cElement],
		["name",	cString, true],
		["value",	cObject, true, true]
	]);
//<-Guard

	return fQuery_data(new cQuery(oElement), sName, oValue);
};