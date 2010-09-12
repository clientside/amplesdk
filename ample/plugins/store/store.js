/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fAmple_store(oNode, sName, vValue) {

};

// Extend ample
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

// Extend AMLQuery
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
}, AMLQuery.prototype);
