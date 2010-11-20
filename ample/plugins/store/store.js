/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Private members
function fAmple_store(oNode, sName, vValue) {

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
ample.extend({
	"store":	function(sName, vValue) {
		// Validate API call
		ample.guard(arguments, [
			["name",	cString],
			["value",	cObject, true, true]
		]);

		// Invoke implementation
		return fAmple_store(this, sName, vValue);
	}
}, ample.classes.Query.prototype);
