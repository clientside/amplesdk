/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLStringList	= function(){};

cAMLStringList.prototype.length	= 0;

cAMLStringList.prototype.item		= function(nIndex) {
//->Guard
	fGuard(arguments, [
		["index",	cNumber]
	]);
//<-Guard

	return nIndex < this.length ? this[nIndex] : null;
};

function fAMLStringList_contains(oStringList, sValue) {
	for (var nIndex = 0; nIndex < oStringList.length; nIndex++)
		if (oStringList[nIndex] == sValue)
			return true;
	return false;
};

cAMLStringList.prototype.contains	= function(sValue) {
//->Guard
	fGuard(arguments, [
		["value",	cString]
	]);
//<-Guard

	return fAMLStringList_contains(this, sValue);
};

cAMLStringList.prototype.$add	= function(sValue) {
	this[this.length++]	= sValue;
};

cAMLStringList.prototype.$remove	= function(sValue) {
	for (var nIndex = 0, bFound = false; nIndex < this.length; nIndex++)
		if (bFound)
			this[nIndex - 1]	= this[nIndex];
		else
		if (this[nIndex] == sValue)
			bFound	= true;
	if (bFound)
		delete this[--this.length];
};
