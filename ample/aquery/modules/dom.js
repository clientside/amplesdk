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
	// Validate API call
	aQuery.guard(arguments, [
		["name",	window.String],
		["value",	window.Object, true]
	]);

	// Invoke implementation
	if (arguments.length > 1)
		aQuery.each(this, function() {
			this.setAttribute(vArgument1, vArgument2);
		});
	else
	if (this.length)
		return this[0].getAttribute(vArgument1);
	return this;
});

// Text (get/set)
aQuery.extend("text", function(vArgument1) {
	// Validate API call
	aQuery.guard(arguments, [
		["value",	window.Object, true]
	]);

	// Invoke implementation
	if (arguments.length > 0) {
		// Replace children with a text node
		aQuery.each(this, function() {
			while (this.lastChild)
				this.removeChild(this.lastChild);
			// Add child
			this.appendChild(this.ownerDocument.createTextNode(vArgument1));
		});
	}
	else {
		// Get inner text
		var aText	= [];
		aQuery.each(this, function(){
			(function fText(oNode) {
				for (; oNode; oNode = oNode.nextSibling)
					if (oNode instanceof window.AMLCharacterData)
						aText.push(oNode.data);
					else
					if (oNode instanceof window.AMLElement && oNode.hasChildNodes())
						aText.push(fText(oNode.firstChild));
			})(this);
		});
		return aText.join('');
	}
	return this;
});

// Structure
//
aQuery.extend("appendTo", function(vArgument1) {
	// Validate API call
	aQuery.guard(arguments, [
		["target",	window.Object]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		var that	= this;
		aQuery.each(oQuery, function() {
			var oParent	= this;
			that.each(function() {
				oParent.appendChild(this.cloneNode(true));
			});
		});
	}
	return this;
});

aQuery.extend("prependTo", function(vArgument1) {
	// Validate API call
	aQuery.guard(arguments, [
		["target",	window.Object]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		var that	= this;
		aQuery.each(oQuery, function() {
			var oParent	= this,
				oBefore	= this.firstChild;
			aQuery.each(that, function() {
				oParent.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
});

aQuery.extend("insertBefore", function(vArgument1) {
	// Validate API call
	aQuery.guard(arguments, [
		["anchor",	window.Object]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		var that	= this;
		aQuery.each(oQuery, function() {
			var oNode	= this,
				oBefore	= this;
			aQuery.each(that, function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
});

aQuery.extend("insertAfter", function(vArgument1) {
	// Validate API call
	aQuery.guard(arguments, [
		["anchor",	window.Object]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		var that	= this;
		aQuery.each(oQuery, function() {
			var oNode	= this,
				oBefore	= this.nextSibling;
			aQuery.each(that, function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
});

aQuery.extend("replaceAll", function(vArgument1) {
	// Validate API call
	aQuery.guard(arguments, [
		["source",	window.Object]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		var that	= this;
		aQuery.each(oQuery, function() {
			var oNode	= this,
				oBefore	= this;
			aQuery.each(that, function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
			this.parentNode.removeChild(this);
		});
	}
	return this;
});

//
aQuery.extend("append", function(vArgument1) {
	// Validate API call
	aQuery.guard(arguments, [
		["source",	window.Object]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		aQuery.each(this, function() {
			var oParent	= this;
			aQuery.each(oQuery, function() {
				oParent.appendChild(this.cloneNode(true));
			});
		});
	}
	return this;
});

aQuery.extend("prepend", function(vArgument1) {
	// Validate API call
	aQuery.guard(arguments, [
		["source",	window.Object]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		aQuery.each(this, function() {
			var oParent	= this,
				oBefore	= this.firstChild;
			aQuery.each(oQuery, function() {
				oParent.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
});

aQuery.extend("before", function(vArgument1) {
	// Validate API call
	aQuery.guard(arguments, [
		["source",	window.Object]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		aQuery.each(this, function() {
			var oNode	= this,
				oBefore	= this;
			aQuery.each(oQuery, function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
});

aQuery.extend("after", function(vArgument1) {
	// Validate API call
	aQuery.guard(arguments, [
		["source",	window.Object]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		aQuery.each(this, function() {
			var oNode	= this,
				oBefore	= this.nextSibling;
			aQuery.each(oQuery, function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
});

//
aQuery.extend("remove", function() {
	// Invoke implementation
	aQuery.each(this, function() {
		this.parentNode.removeChild(this);
	});
	return this;
});

aQuery.extend("empty", function() {
	// Invoke implementation
	aQuery.each(this, function() {
		while (this.lastChild)
			this.removeChild(this.lastChild);
	});
	return this;
});

//
aQuery.extend("replaceWith", function(vArgument1) {
	// Validate API call
	aQuery.guard(arguments, [
		["source",	window.Object]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		aQuery.each(this, function() {
			var oNode	= this,
				oBefore	= this;
			aQuery.each(oQuery, function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
			this.parentNode.removeChild(this);
		});
	}
	return this;
});

//
aQuery.extend("clone", function() {
	// Invoke implementation
	var oQuery	= aQuery();
	aQuery.each(this, function() {
		oQuery[oQuery.length++]	= this.cloneNode(true);
	});
	return oQuery;
});