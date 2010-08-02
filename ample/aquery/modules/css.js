/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

aQuery.extend("css", function(vArgument1, vArgument2) {
	// Validate API call
	aQuery.guard(arguments, [
		["name",	window.String],
		["value",	window.String, true]
	]);

	// Invoke implementation
	if (arguments.length > 1)
		aQuery.each(this, function() {
			this.$setStyle(vArgument1, vArgument2);
		});
	else
	if (this.length)
		return this[0].$getStyle(vArgument1);
	return this;
});