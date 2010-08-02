/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

pAmple.prototype.css	= function(vArgument1, vArgument2) {
	// Validate API call
	fAML_validate(arguments, [
		["name",	cString],
		["value",	cString, true]
	]);

	// Invoke implementation
	if (arguments.length > 1) {
		fAmple_each(this, function() {
			var oElementDOM	= this.$getContainer();
			if (oElementDOM)
				fAML_setStyle(oElementDOM, vArgument1, vArgument2);
		});
		return this;
	}
	else
	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		return oElementDOM ? fAML_getStyle(oElementDOM, vArgument1) : '';
	}
};