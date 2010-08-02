/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Events
cAMLQuery.prototype.trigger	= function(sType, oDetail) {
	// Validate API call
	fAML_validate(arguments, [
		["type",	cString],
		["detail",	oDetail, true, true]
	]);

	// Invoke implementation
	if (arguments.length < 2)
		oDetail	= null;
	fAmple_each(this, function() {
		var oEvent	= oAML_document.createEvent("CustomEvent");
		oEvent.initCustomEvent(sType, true, true, oDetail);
		this.dispatchEvent(oEvent);
	});
};

cAMLQuery.prototype.bind	= function(sType, fHandler, bCapture) {
	// Validate API call
	fAML_validate(arguments, [
		["type",	cString],
		["handler",	cFunction],
		["capture",	cBoolean,	true]
	]);

	// Invoke implementation
	fAmple_each(this, function() {
		this.addEventListener(sType, fHandler, bCapture || false);
	});
	return this;
};

cAMLQuery.prototype.unbind	= function(sType, fHandler, bCaprure) {
	// Validate API call
	fAML_validate(arguments, [
		["type",	cString],
		["handler",	cFunction],
		["capture",	cBoolean,	true]
	]);

	// Invoke implementation
	fAmple_each(this, function() {
		this.removeEventListener(sType, fHandler, bCapture || false);
	});
	return this;
};