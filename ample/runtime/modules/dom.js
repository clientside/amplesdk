/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Attributes (get/set)
pAmple.prototype.attr	= function(vArgument1, vArgument2) {
	// Validate API call
	fAML_validate(arguments, [
		["name",	cString],
		["value",	cObject, true]
	]);

	// Invoke implementation
	if (arguments.length > 1) {
		fAmple_each(this, function() {
			this.setAttribute(vArgument1, vArgument2);
		});
		return this;
	}
	else
	if (this.length)
		return this[0].getAttribute(vArgument1);
};

// Text (get/set)
pAmple.prototype.text	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["value",	cObject, true]
	]);

	// Invoke implementation
	if (arguments.length > 0) {
		// Replace children with a text node
		fAmple_each(this, function() {
			while (this.lastChild)
				this.removeChild(this.lastChild);
			// Add child
			this.appendChild(this.ownerDocument.createTextNode(vArgument1));
		});
		return this;
	}
	else {
		// Get inner text
		var aText	= [];
		fAmple_each(this, function(){
			(function fText(oNode) {
				for (; oNode; oNode = oNode.nextSibling)
					if (oNode instanceof cAMLCharacterData)
						aText.push(oNode.data);
					else
					if (oNode instanceof cAMLElement && oNode.hasChildNodes())
						aText.push(fText(oNode.firstChild));
			})(this);
		});
		return aText.join('');
	}
};

// Structure
//
pAmple.prototype.appendTo	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["target",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof fAmple))
			oQuery	= fAmple(oQuery);
		//
		var that	= this;
		fAmple_each(oQuery, function() {
			var oParent	= this;
			that.each(function() {
				oParent.appendChild(this.cloneNode(true));
			});
		});
	}
	return this;
};

pAmple.prototype.prependTo	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["target",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof fAmple))
			oQuery	= fAmple(oQuery);
		//
		var that	= this;
		fAmple_each(oQuery, function() {
			var oParent	= this,
				oBefore	= this.firstChild;
			fAmple_each(that, function() {
				oParent.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
};

pAmple.prototype.insertBefore	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["anchor",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof fAmple))
			oQuery	= fAmple(oQuery);
		//
		var that	= this;
		fAmple_each(oQuery, function() {
			var oNode	= this,
				oBefore	= this;
			fAmple_each(that, function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
};

pAmple.prototype.insertAfter	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["anchor",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof fAmple))
			oQuery	= fAmple(oQuery);
		//
		var that	= this;
		fAmple_each(oQuery, function() {
			var oNode	= this,
				oBefore	= this.nextSibling;
			fAmple_each(that, function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
};

pAmple.prototype.replaceAll	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof fAmple))
			oQuery	= fAmple(oQuery);
		//
		var that	= this;
		fAmple_each(oQuery, function() {
			var oNode	= this,
				oBefore	= this;
			fAmple_each(that, function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
			this.parentNode.removeChild(this);
		});
	}
	return this;
};

//
pAmple.prototype.append	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof fAmple))
			oQuery	= fAmple(oQuery);
		//
		fAmple_each(this, function() {
			var oParent	= this;
			fAmple_each(oQuery, function() {
				oParent.appendChild(this.cloneNode(true));
			});
		});
	}
	return this;
};

pAmple.prototype.prepend	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof fAmple))
			oQuery	= fAmple(oQuery);
		//
		fAmple_each(this, function() {
			var oParent	= this,
				oBefore	= this.firstChild;
			fAmple_each(oQuery, function() {
				oParent.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
};

pAmple.prototype.before	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof fAmple))
			oQuery	= fAmple(oQuery);
		//
		fAmple_each(this, function() {
			var oNode	= this,
				oBefore	= this;
			fAmple_each(oQuery, function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
};

pAmple.prototype.after	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof fAmple))
			oQuery	= fAmple(oQuery);
		//
		fAmple_each(this, function() {
			var oNode	= this,
				oBefore	= this.nextSibling;
			fAmple_each(oQuery, function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
};

//
pAmple.prototype.remove	= function() {
	// Invoke implementation
	fAmple_each(this, function() {
		this.parentNode.removeChild(this);
	});
	return this;
};

pAmple.prototype.empty	= function() {
	// Invoke implementation
	fAmple_each(this, function() {
		while (this.lastChild)
			this.removeChild(this.lastChild);
	});
	return this;
};

//
pAmple.prototype.replaceWith	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof fAmple))
			oQuery	= fAmple(oQuery);
		//
		fAmple_each(this, function() {
			var oNode	= this,
				oBefore	= this;
			fAmple_each(oQuery, function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
			this.parentNode.removeChild(this);
		});
	}
	return this;
};

//
pAmple.prototype.clone	= function() {
	// Invoke implementation
	var oQuery	= fAmple();
	fAmple_each(this, function() {
		oQuery[oQuery.length++]	= this.cloneNode(true);
	});
	return oQuery;
};