/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Private members
function fAmple_store(oNode, sName, vValue) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

// Extend ample object
ample.extend({
	//
	"store":	function(sName, vValue) {
		// Validate API call
		ample.guard(arguments, [
			["name",	cString],
			["value",	cObject, true, true]
		]);

		// Invoke implementation
		return fAmple_store(this, sName, vValue);
	}
});

// Extend Query
ample.extend(ample.classes.Query.prototype, {
	"store":	function(sName, vValue) {
		// Validate API call
		ample.guard(arguments, [
			["name",	cString],
			["value",	cObject, true, true]
		]);

		// Invoke implementation
		return fAmple_store(this, sName, vValue);
	}
});
