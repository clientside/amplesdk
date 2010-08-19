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
	fGuard(arguments, [
		["name",	cString],
		["value",	cObject, true]
	]);

	// Invoke implementation
	if (arguments.length > 1) {
		var aQName		= sName.split(':'),
			sNameSpaceURI	= null;
		if (aQName.length > 1)
			sNameSpaceURI	= oAmple.namespaces["xmlns" + ':' + aQName[0]] || null;
		fAMLQuery_each(this, function() {
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
	fGuard(arguments, [
		["value",	cObject, true]
	]);

	// Invoke implementation
	if (arguments.length > 0) {
		// Replace children with a text node
		fAMLQuery_each(this, function() {
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
		fAMLQuery_each(this, function(){
			aText.push(fAMLNode_getTextContent(this));
		});
		return aText.join('');
	}
};

cAMLQuery.prototype.html	= function() {
	// Validate API call
	fGuard(arguments, [
		["value",	cObject, true]
	]);

	if (arguments.length > 0) {
		fAMLQuery_each(this, function() {

		});
	}
	else
	if (this.length) {
		var aHtml	= [];
		for (var oNode = this[0].firstChild; oNode; oNode = oNode.nextSibling)
			aHtml.push(oNode.toXML());
		return aHtml.join('');
	}
};

// Structure
//
cAMLQuery.prototype.appendTo	= function(vArgument1) {
	// Validate API call
	fGuard(arguments, [
		["target",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1 instanceof cAMLQuery ? vArgument1 : fQuery(vArgument1);
		//
		var oSelf	= this;
		fAMLQuery_each(oQuery, function() {
			var oParent	= this;
			oSelf.each(function() {
				fAMLElement_appendChild(oParent, fAMLNode_cloneNode(this, true));
			});
		});
	}
	return this;
};

cAMLQuery.prototype.prependTo	= function(vArgument1) {
	// Validate API call
	fGuard(arguments, [
		["target",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1 instanceof cAMLQuery ? vArgument1 : fQuery(vArgument1);
		//
		var oSelf	= this;
		fAMLQuery_each(oQuery, function() {
			var oParent	= this,
				oBefore	= this.firstChild;
			fAMLQuery_each(oSelf, function() {
				if (oBefore)
					fAMLElement_insertBefore(oParent, fAMLNode_cloneNode(this, true), oBefore);
				else
					fAMLElement_appendChild(oParent, fAMLNode_cloneNode(this, true));
			});
		});
	}
	return this;
};

cAMLQuery.prototype.insertBefore	= function(vArgument1) {
	// Validate API call
	fGuard(arguments, [
		["anchor",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1 instanceof cAMLQuery ? vArgument1 : fQuery(vArgument1);
		//
		var oSelf	= this;
		fAMLQuery_each(oQuery, function() {
			var oNode	= this,
				oBefore	= this;
			fAMLQuery_each(oSelf, function() {
				fAMLElement_insertBefore(oNode.parentNode, fAMLNode_cloneNode(this, true), oBefore);
			});
		});
	}
	return this;
};

cAMLQuery.prototype.insertAfter	= function(vArgument1) {
	// Validate API call
	fGuard(arguments, [
		["anchor",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1 instanceof cAMLQuery ? vArgument1 : fQuery(vArgument1);
		//
		var oSelf	= this;
		fAMLQuery_each(oQuery, function() {
			var oNode	= this,
				oBefore	= this.nextSibling;
			fAMLQuery_each(oSelf, function() {
				if (oBefore)
					fAMLElement_insertBefore(oNode.parentNode, fAMLNode_cloneNode(this, true), oBefore);
				else
					fAMLElement_appendChild(oNode.parentNode, fAMLNode_cloneNode(this, true));
			});
		});
	}
	return this;
};

cAMLQuery.prototype.replaceAll	= function(vArgument1) {
	// Validate API call
	fGuard(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1 instanceof cAMLQuery ? vArgument1 : fQuery(vArgument1);
		//
		var oSelf	= this;
		fAMLQuery_each(oQuery, function() {
			var oNode	= this,
				oBefore	= this;
			fAMLQuery_each(oSelf, function() {
				fAMLElement_insertBefore(oNode.parentNode, fAMLNode_cloneNode(this, true), oBefore);
			});
			fAMLElement_removeChild(this.parentNode, this);
		});
	}
	return this;
};

//
cAMLQuery.prototype.append	= function(vArgument1) {
	// Validate API call
	fGuard(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1 instanceof cAMLQuery ? vArgument1 : fQuery(vArgument1);
		//
		fAMLQuery_each(this, function() {
			var oParent	= this;
			fAMLQuery_each(oQuery, function() {
				fAMLElement_appendChild(oParent, fAMLNode_cloneNode(this, true));
			});
		});
	}
	return this;
};

cAMLQuery.prototype.prepend	= function(vArgument1) {
	// Validate API call
	fGuard(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1 instanceof cAMLQuery ? vArgument1 : fQuery(vArgument1);
		//
		fAMLQuery_each(this, function() {
			var oParent	= this,
				oBefore	= this.firstChild;
			fAMLQuery_each(oQuery, function() {
				if (oBefore)
					fAMLElement_insertBefore(oParent, fAMLNode_cloneNode(this, true), oBefore);
				else
					fAMLElement_appendChild(oParent, fAMLNode_cloneNode(this, true));
			});
		});
	}
	return this;
};

cAMLQuery.prototype.before	= function(vArgument1) {
	// Validate API call
	fGuard(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1 instanceof cAMLQuery ? vArgument1 : fQuery(vArgument1);
		//
		fAMLQuery_each(this, function() {
			var oNode	= this,
				oBefore	= this;
			fAMLQuery_each(oQuery, function() {
				if (oNode.parentNode)
					fAMLElement_insertBefore(oNode.parentNode, fAMLNode_cloneNode(this, true), oBefore);
				else {
					// TODO: insert into self collection before
				}
			});
		});
	}
	return this;
};

cAMLQuery.prototype.after	= function(vArgument1) {
	// Validate API call
	fGuard(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1 instanceof cAMLQuery ? vArgument1 : fQuery(vArgument1);
		//
		fAMLQuery_each(this, function() {
			var oNode	= this,
				oBefore	= this.nextSibling;
			fAMLQuery_each(oQuery, function() {
				if (oNode.parentNode) {
					if (oBefore)
						fAMLElement_insertBefore(oNode.parentNode, fAMLNode_cloneNode(this, true), oBefore);
					else
						fAMLElement_appendChild(oNode.parentNode, fAMLNode_cloneNode(this, true));
				}
				else {
					// TODO: insert into self collection after
				}
			});
		});
	}
	return this;
};

//
cAMLQuery.prototype.remove	= function() {
	// Invoke implementation
	fAMLQuery_each(this, function() {
		fAMLElement_removeChild(this.parentNode, this);
	});
	return this;
};

cAMLQuery.prototype.empty	= function() {
	// Invoke implementation
	fAMLQuery_each(this, function() {
		while (this.lastChild)
			fAMLElement_removeChild(this, this.lastChild);
	});
	return this;
};

//
cAMLQuery.prototype.replaceWith	= function(vArgument1) {
	// Validate API call
	fGuard(arguments, [
		["source",	cObject]
	]);

	// Invoke implementation
	if (this.length) {
		//
		var oQuery	= vArgument1 instanceof cAMLQuery ? vArgument1 : fQuery(vArgument1);
		//
		fAMLQuery_each(this, function() {
			var oNode	= this,
				oBefore	= this;
			fAMLQuery_each(oQuery, function() {
				fAMLElement_insertBefore(oNode.parentNode, fAMLNode_cloneNode(this, true), oBefore);
			});
			fAMLElement_removeChild(this.parentNode, this);
		});
	}
	return this;
};

//
cAMLQuery.prototype.clone	= function() {
	// Invoke implementation
	var oQuery	= new cAMLQuery;
	fAMLQuery_each(this, function() {
		oQuery[oQuery.length++]	= fAMLNode_cloneNode(this, true);
	});
	return oQuery;
};