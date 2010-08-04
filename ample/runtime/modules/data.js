/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oAMLQuery_cache	= {};

cAMLQuery.prototype.data	= function(sName, oValue) {
	// Validate API call
	fAML_validate(arguments, [
		["name",	cString],
		["value",	cObject, true, true]
	]);

	// Invoke implementation
	if (arguments.length > 1) {
		fAmple_each(this, function() {
			if (oValue == null)
				delete oAMLQuery_cache[this.uniqueID];
			else
				oAMLQuery_cache[this.uniqueID]	= oValue;
		});
		return this;
	}
	else
	if (this.length) {
		return this[0].uniqueID in oAMLQuery_cache ? oAMLQuery_cache[this[0].uniqueID] : null;
	}
};