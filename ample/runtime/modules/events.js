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
	fGuard(arguments, [
		["type",	cString],
		["detail",	oDetail, true, true]
	]);

	// Invoke implementation
	if (arguments.length < 2)
		oDetail	= null;
	fAMLQuery_each(this, function() {
		var oEvent	= new cAMLCustomEvent;
		oEvent.initCustomEvent(sType, true, true, oDetail);
		fAMLNode_dispatchEvent(this, oEvent);
	});
};

cAMLQuery.prototype.bind	= function(sType, fHandler, bCapture) {
	// Validate API call
	fGuard(arguments, [
		["type",	cString],
		["handler",	cFunction],
		["capture",	cBoolean,	true]
	]);

	// Invoke implementation
	fAMLQuery_each(this, function() {
		fAMLEventTarget_addEventListener(this, sType, fHandler, bCapture || false);
	});
	return this;
};

cAMLQuery.prototype.unbind	= function(sType, fHandler, bCaprure) {
	// Validate API call
	fGuard(arguments, [
		["type",	cString],
		["handler",	cFunction],
		["capture",	cBoolean,	true]
	]);

	// Invoke implementation
	fAMLQuery_each(this, function() {
		fAMLEventTarget_removeEventListener(this, sType, fHandler, bCapture || false);
	});
	return this;
};