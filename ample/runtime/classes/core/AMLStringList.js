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
	// Validate arguments
	fGuard(arguments, [
		["index",	cNumber]
	]);

	return nIndex < this.length ? this[nIndex] : null;
};

cAMLStringList.prototype.contains	= function(sValue) {
	// Validate arguments
	fGuard(arguments, [
		["value",	cString]
	]);

	for (var nIndex = 0; nIndex < this.length; nIndex++)
		if (this[nIndex] == sValue)
			return true;
	return false;
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
