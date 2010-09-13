/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
cAMLQuery.prototype.width	= function(sValue) {
	// Validate API call
	fGuard(arguments, [
		["value",	cObject, true]
	]);

	if (arguments.length) {
		fAMLQuery_each(this, function() {
			var oElementDOM	= this.$getContainer();
			fBrowser_setStyle(oElementDOM, "width", sValue +(fIsNaN(sValue) ? '' : 'px'));
		});
		return this;
	}
	else
	if (this.length) {
		var oRect	= fAMLElement_getBoundingClientRect(this[0]);
		return oRect.right - oRect.left;
	}
};

cAMLQuery.prototype.height	= function(sValue) {
	// Validate API call
	fGuard(arguments, [
		["value",	cObject, true]
	]);

	if (arguments.length) {
		fAMLQuery_each(this, function() {
			var oElementDOM	= this.$getContainer();
			fBrowser_setStyle(oElementDOM, "height", sValue +(fIsNaN(sValue) ? '' : 'px'));
		});
		return this;
	}
	else
	if (this.length) {
		var oRect	= fAMLElement_getBoundingClientRect(this[0]);
		return oRect.bottom - oRect.top;
	}
};

cAMLQuery.prototype.innerWidth	= function() {
	// Validate API call
	fGuard(arguments, [
		["value",	cObject, true]
	]);

	return this;
};

cAMLQuery.prototype.innerHeight	= function() {
	// Validate API call
	fGuard(arguments, [
		["value",	cObject, true]
	]);

	return this;
};

cAMLQuery.prototype.outerWidth	= function() {
	// Validate API call
	fGuard(arguments, [
		["value",	cObject, true]
	]);

	return this;
};

cAMLQuery.prototype.outerHeight	= function() {
	// Validate API call
	fGuard(arguments, [
		["value",	cObject, true]
	]);

	return this;
};