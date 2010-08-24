/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

cAMLQuery.prototype.css	= function(sName, sValue) {
	// Validate API call
	fGuard(arguments, [
		["name",	cString],
		["value",	cString, true]
	]);

	// Invoke implementation
	sName	= fUtilities_toCssPropertyName(sName);
	if (arguments.length > 1) {
		fAMLQuery_each(this, function() {
			var oElementDOM	= this.$getContainer();
			if (oElementDOM)
				fBrowser_setStyle(oElementDOM, sName, sValue);
		});
		return this;
	}
	else
	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		return oElementDOM ? fBrowser_getStyle(oElementDOM, sName) : '';
	}
};