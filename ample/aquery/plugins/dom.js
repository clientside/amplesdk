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
	if (arguments.length > 1)
		this.each(function() {
			this.setAttribute(vArgument1, vArgument2);
		});
	else
	if (this.length)
		return this[0].getAttribute(vArgument1);
	return this;
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
//
aQuery.extend("appendTo", function(vArgument1) {
	this.each(function() {
		vArgument1.appendChild(this);
	});
	return this;
});

aQuery.extend("prependTo", function(vArgument1) {
	var oBefore	= vArgument1.firstChild;
	this.each(function() {
		vArgument1.insertBefore(this, oBefore);
	});
	return this;
});

aQuery.extend("insertBefore", function(vArgument1) {
	this.each(function() {
		vArgument1.parentNode.insertBefore(this, vArgument1);
	});
	return this;
});

aQuery.extend("insertAfter", function(vArgument1) {
	this.each(function() {
		vArgument1.parentNode.appendChild(this);
	});
	return this;
});

//
aQuery.extend("append", function(vArgument1) {
	var oQuery	= vArgument1;
	if (!(oQuery instanceof aQuery))
		oQuery	= aQuery(oQuery);
	if (this.length) {
		var oParent	= this[0];
		oQuery.each(function() {
			oParent.appendChild(this);
		});
	}
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

//
aQuery.extend("remove", function(vArgument1) {
	return this;
});

aQuery.extend("empty", function(vArgument1) {
	return this;
});

//
aQuery.extend("replaceAll", function(vArgument1) {
	// TODO
	return this;
});

aQuery.extend("replaceWith", function(vArgument1) {
	// TODO
	return this;
});

//
aQuery.extend("clone", function(vArgument1) {
	return this;
});