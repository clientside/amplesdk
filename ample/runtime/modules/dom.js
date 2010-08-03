/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Attributes (get/set)
cAMLQuery.prototype.attr	= function(sName, sValue) {
	// Validate API call
	fAML_validate(arguments, [
		["name",	cString],
		["value",	cObject, true]
	]);

	// Invoke implementation
	if (arguments.length > 1) {
		var aQName		= sName.split(':'),
			sNameSpaceURI	= null;
		if (aQName.length > 1)
			sNameSpaceURI	= fAmple.namespaces["xmlns" + ':' + aQName[0]] || null;
		fAmple_each(this, function() {
			fAMLElement_setAttributeNS(this, sNameSpaceURI, sName, cString(sValue));
		});
		return this;
	}
	else
	if (this.length)
		return fAMLElement_getAttribute(this[0], sName);
};

// Text (get/set)
cAMLQuery.prototype.text	= function(sValue) {
	// Validate API call
	fAML_validate(arguments, [
		["value",	cObject, true]
	]);

	// Invoke implementation
	if (arguments.length > 0) {
		// Replace children with a text node
		fAmple_each(this, function() {
			while (this.lastChild)
				fAMLElement_removeChild(this, this.lastChild);
			// Add child
			fAMLElement_appendChild(this, fAMLDocument_createTextNode(this.ownerDocument, cString(sValue)));
		});
		return this;
	}
	else {
		// Get inner text
		var aText	= [];
		fAmple_each(this, function(){
			aText.push(fAMLNode_getTextContent(this));
		});
		return aText.join('');
	}
};

// Structure
//
cAMLQuery.prototype.appendTo	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["target",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof cAMLQuery))
			oQuery	= fAmple(oQuery);
		//
		var that	= this;
		fAmple_each(oQuery, function() {
			var oParent	= this;
			that.each(function() {
				fAMLElement_appendChild(oParent, fAMLElement_cloneNode(this, true));
			});
		});
	}
	return this;
};

cAMLQuery.prototype.prependTo	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["target",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof cAMLQuery))
			oQuery	= fAmple(oQuery);
		//
		var that	= this;
		fAmple_each(oQuery, function() {
			var oParent	= this,
				oBefore	= this.firstChild;
			fAmple_each(that, function() {
				fAMLElement_insertBefore(oParent, fAMLElement_cloneNode(this, true), oBefore);
			});
		});
	}
	return this;
};

cAMLQuery.prototype.insertBefore	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["anchor",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof cAMLQuery))
			oQuery	= fAmple(oQuery);
		//
		var that	= this;
		fAmple_each(oQuery, function() {
			var oNode	= this,
				oBefore	= this;
			fAmple_each(that, function() {
				fAMLElement_insertBefore(oNode.parentNode, fAMLElement_cloneNode(this, true), oBefore);
			});
		});
	}
	return this;
};

cAMLQuery.prototype.insertAfter	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["anchor",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof cAMLQuery))
			oQuery	= fAmple(oQuery);
		//
		var that	= this;
		fAmple_each(oQuery, function() {
			var oNode	= this,
				oBefore	= this.nextSibling;
			fAmple_each(that, function() {
				fAMLElement_insertBefore(oNode.parentNode, fAMLElement_cloneNode(this, true), oBefore);
			});
		});
	}
	return this;
};

cAMLQuery.prototype.replaceAll	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof cAMLQuery))
			oQuery	= fAmple(oQuery);
		//
		var that	= this;
		fAmple_each(oQuery, function() {
			var oNode	= this,
				oBefore	= this;
			fAmple_each(that, function() {
				fAMLElement_insertBefore(oNode.parentNode, fAMLElement_cloneNode(this, true), oBefore);
			});
			fAMLElement_removeChild(this.parentNode, this);
		});
	}
	return this;
};

//
cAMLQuery.prototype.append	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof cAMLQuery))
			oQuery	= fAmple(oQuery);
		//
		fAmple_each(this, function() {
			var oParent	= this;
			fAmple_each(oQuery, function() {
				fAMLElement_appendChild(oParent, fAMLElement_cloneNode(this, true));
			});
		});
	}
	return this;
};

cAMLQuery.prototype.prepend	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof cAMLQuery))
			oQuery	= fAmple(oQuery);
		//
		fAmple_each(this, function() {
			var oParent	= this,
				oBefore	= this.firstChild;
			fAmple_each(oQuery, function() {
				fAMLElement_insertBefore(oParent, fAMLElement_cloneNode(this, true), oBefore);
			});
		});
	}
	return this;
};

cAMLQuery.prototype.before	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof cAMLQuery))
			oQuery	= fAmple(oQuery);
		//
		fAmple_each(this, function() {
			var oNode	= this,
				oBefore	= this;
			fAmple_each(oQuery, function() {
				fAMLElement_insertBefore(oNode.parentNode, fAMLElement_cloneNode(this, true), oBefore);
			});
		});
	}
	return this;
};

cAMLQuery.prototype.after	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof cAMLQuery))
			oQuery	= fAmple(oQuery);
		//
		fAmple_each(this, function() {
			var oNode	= this,
				oBefore	= this.nextSibling;
			fAmple_each(oQuery, function() {
				fAMLElement_insertBefore(oNode.parentNode, fAMLElement_cloneNode(this, true), oBefore);
			});
		});
	}
	return this;
};

//
cAMLQuery.prototype.remove	= function() {
	// Invoke implementation
	fAmple_each(this, function() {
		fAMLElement_removeChild(this.parentNode, this);
	});
	return this;
};

cAMLQuery.prototype.empty	= function() {
	// Invoke implementation
	fAmple_each(this, function() {
		while (this.lastChild)
			fAMLElement_removeChild(this, this.lastChild);
	});
	return this;
};

//
cAMLQuery.prototype.replaceWith	= function(vArgument1) {
	// Validate API call
	fAML_validate(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof cAMLQuery))
			oQuery	= fAmple(oQuery);
		//
		fAmple_each(this, function() {
			var oNode	= this,
				oBefore	= this;
			fAmple_each(oQuery, function() {
				fAMLElement_insertBefore(oNode.parentNode, fAMLElement_cloneNode(this, true), oBefore);
			});
			fAMLElement_removeChild(this.parentNode, this);
		});
	}
	return this;
};

//
cAMLQuery.prototype.clone	= function() {
	// Invoke implementation
	var oQuery	= fAmple();
	fAmple_each(this, function() {
		oQuery[oQuery.length++]	= fAMLElement_cloneNode(this, true);
	});
	return oQuery;
};