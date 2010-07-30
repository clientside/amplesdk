/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Events
aQuery.extend("bind", function(sType, fListener, bCapture) {
	this.each(function() {
		this.addEventListener(sType, fListener, bCapture || false);
	});
	return this;
});

aQuery.extend("unbind", function(sType, fListener, bCaprure) {
	this.each(function() {
		this.removeEventListener(sType, fListener, bCapture || false);
	});
	return this;
});