/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fSsr_import(oElement) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

ample.extend(ample.classes.Query.prototype, {
	import:	function(oElement) {
		// Validate API call
		ample.guard(arguments, [
			["element",	cElement]
		]);

		return fSsr_import(oElement);
	}
});