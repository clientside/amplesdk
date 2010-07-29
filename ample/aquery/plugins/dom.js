/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Attributes (get/set)
aQuery.extend("attr", function(vArgument1, vArgument2) {
	if (arguments.length > 1) {
		this.each(function() {
			this.setAttribute(vArgument1, vArgument2);
		});
		return this;
	}
	else
	if (this.length)
		return this[0].getAttribute(vArgument1);
});

// Text (get/set)
aQuery.extend("text", function(vArgument1) {
	if (arguments.length > 0) {
		// Replace children with a text node
	}
	else {
		// Get inner text
	}
});

// Structure
aQuery.extend("append", function(vArgument1) {
	if (this.length)
		this[0].appendChild(vArgument1);
	return this;
});

aQuery.extend("prepend", function(vArgument1) {
	return this;
});

aQuery.extend("before", function(vArgument1) {
	return this;
});

aQuery.extend("after", function(vArgument1) {
	return this;
});

aQuery.extend("remove", function(vArgument1) {
	return this;
});

aQuery.extend("empty", function(vArgument1) {
	return this;
});

aQuery.extend("clone", function(vArgument1) {
	return this;
});