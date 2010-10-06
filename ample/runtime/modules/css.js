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
		["value",	cObject,	true,	true]
	]);

	// Invoke implementation
	if (arguments.length > 1) {
		sValue	= sValue == null ? '' : cString(sValue);
		if (sValue.match(/^[\.\d]+$/))
			sValue	= sValue + 'px';
		fAMLQuery_each(this, function() {
			this.$setStyle(sName, sValue);
		});
		return this;
	}
	else
	if (this.length)
		return this[0].$getStyleComputed(sName);
	return null;
};