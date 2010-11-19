/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */


// Text (get/set)
cAMLQuery.prototype.text	= function(sValue) {
//->Guard
	fGuard(arguments, [
		["value",	cObject, true]
	]);
//<-Guard

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

cAMLQuery.prototype.html	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["value",	cObject, true]
	]);
//<-Guard

	if (arguments.length > 0) {
		// Empty
		fAMLQuery_empty(this);
		//
		return this.append(fQuery(vArgument1));
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
//->Guard
	fGuard(arguments, [
		["target",	cObject]
	]);
//<-Guard

	var oQuery	= new cAMLQuery;
	if (this.length) {
		//
		if (!(vArgument1 instanceof cAMLQuery))
			vArgument1	= fQuery(vArgument1);
		//
		var oSelf	= this;
		fAMLQuery_each(vArgument1, function(nIndex) {
			var oParent	= this;
			oSelf.each(function() {
				var oNode	= nIndex ? fAMLNode_cloneNode(this, true) : this;
				fAMLElement_appendChild(oParent, oNode);
				oQuery[oQuery.length++] = oNode;
			});
		});
	}
	return oQuery;
};

cAMLQuery.prototype.prependTo	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["target",	cObject]
	]);
//<-Guard

	var oQuery	= new cAMLQuery;
	if (this.length) {
		//
		if (!(vArgument1 instanceof cAMLQuery))
			vArgument1	= fQuery(vArgument1);
		//
		var oSelf	= this;
		fAMLQuery_each(vArgument1, function(nIndex) {
			var oParent	= this,
				oBefore	= this.firstChild;
			fAMLQuery_each(oSelf, function() {
				var oNode	= nIndex ? fAMLNode_cloneNode(this, true) : this;
				if (oBefore)
					fAMLElement_insertBefore(oParent, oNode, oBefore);
				else
					fAMLElement_appendChild(oParent, oNode);
				oQuery[oQuery.length++] = oNode;
			});
		});
	}
	return oQuery;
};

cAMLQuery.prototype.insertBefore	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["anchor",	cObject]
	]);
//<-Guard

	var oQuery	= new cAMLQuery;
	if (this.length) {
		//
		if (!(vArgument1 instanceof cAMLQuery))
			vArgument1	= fQuery(vArgument1);
		//
		var oSelf	= this;
		fAMLQuery_each(vArgument1, function(nIndex) {
			var oParent	= this.parentNode,
				oBefore	= this;
			fAMLQuery_each(oSelf, function() {
				var oNode	= nIndex ? fAMLNode_cloneNode(this, true) : this;
				fAMLElement_insertBefore(oParent, oNode, oBefore);
				oQuery[oQuery.length++] = oNode;
			});
		});
	}
	return oQuery;
};

cAMLQuery.prototype.insertAfter	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["anchor",	cObject]
	]);
//<-Guard

	var oQuery	= new cAMLQuery;
	if (this.length) {
		//
		if (!(vArgument1 instanceof cAMLQuery))
			vArgument1	= fQuery(vArgument1);
		//
		var oSelf	= this;
		fAMLQuery_each(vArgument1, function(nIndex) {
			var oParent	= this.parentNode,
				oBefore	= this.nextSibling;
			fAMLQuery_each(oSelf, function() {
				var oNode	= nIndex ? fAMLNode_cloneNode(this, true) : this;
				if (oBefore)
					fAMLElement_insertBefore(oParent, oNode, oBefore);
				else
					fAMLElement_appendChild(oParent, oNode);
				oQuery[oQuery.length++] = oNode;
			});
		});
	}
	return oQuery;
};

cAMLQuery.prototype.replaceAll	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["source",	cObject]
	]);
//<-Guard

	var oQuery	= new cAMLQuery;
	if (this.length) {
		//
		if (!(vArgument1 instanceof cAMLQuery))
			vArgument1	= fQuery(vArgument1);
		//
		var oSelf	= this;
		fAMLQuery_each(vArgument1, function(nIndex) {
			var oParent	= this.parentNode,
				oBefore	= this;
			fAMLQuery_each(oSelf, function() {
				var oNode	= nIndex ? fAMLNode_cloneNode(this, true) : this;
				fAMLElement_insertBefore(oParent, oNode, oBefore);
				oQuery[oQuery.length++] = oNode;
			});
			fAMLElement_removeChild(this.parentNode, this);
		});
	}
	return oQuery;
};

//
cAMLQuery.prototype.append	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["source",	cObject]
	]);
//<-Guard

	if (this.length) {
		//
		if (!(vArgument1 instanceof cAMLQuery))
			vArgument1	= fQuery(vArgument1);
		//
		fAMLQuery_each(this, function(nIndex) {
			var oParent	= this;
			fAMLQuery_each(vArgument1, function() {
				var oNode	= nIndex ? fAMLNode_cloneNode(this, true) : this;
				fAMLElement_appendChild(oParent, oNode);
			});
		});
	}
	return this;
};

cAMLQuery.prototype.prepend	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["source",	cObject]
	]);
//<-Guard

	if (this.length) {
		//
		if (!(vArgument1 instanceof cAMLQuery))
			vArgument1	= fQuery(vArgument1);
		//
		fAMLQuery_each(this, function(nIndex) {
			var oParent	= this,
				oBefore	= this.firstChild;
			fAMLQuery_each(vArgument1, function() {
				var oNode	= nIndex ? fAMLNode_cloneNode(this, true) : this;
				if (oBefore)
					fAMLElement_insertBefore(oParent, oNode, oBefore);
				else
					fAMLElement_appendChild(oParent, oNode);
			});
		});
	}
	return this;
};

cAMLQuery.prototype.before	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["source",	cObject]
	]);
//<-Guard

	if (this.length) {
		//
		if (!(vArgument1 instanceof cAMLQuery))
			vArgument1	= fQuery(vArgument1);
		//
		fAMLQuery_each(this, function(nIndex) {
			var oParent	= this.parentNode,
				oBefore	= this;
			fAMLQuery_each(vArgument1, function() {
				var oNode	= nIndex ? fAMLNode_cloneNode(this, true) : this;
				if (oParent)
					fAMLElement_insertBefore(oParent, oNode, oBefore);
				else {
					// TODO: insert into self collection before
				}
			});
		});
	}
	return this;
};

cAMLQuery.prototype.after	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["source",	cObject]
	]);
//<-Guard

	if (this.length) {
		//
		if (!(vArgument1 instanceof cAMLQuery))
			vArgument1	= fQuery(vArgument1);
		//
		fAMLQuery_each(this, function(nIndex) {
			var oParent	= this.parentNode,
				oBefore	= this.nextSibling;
			fAMLQuery_each(vArgument1, function() {
				var oNode	= nIndex ? fAMLNode_cloneNode(this, true) : this;
				if (oParent) {
					if (oBefore)
						fAMLElement_insertBefore(oParent, oNode, oBefore);
					else
						fAMLElement_appendChild(oParent, oNode);
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
cAMLQuery.prototype.replaceWith	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["source",	cObject]
	]);
//<-Guard

	if (this.length) {
		//
		if (!(vArgument1 instanceof cAMLQuery))
			vArgument1	= fQuery(vArgument1);
		//
		fAMLQuery_each(this, function(nIndex) {
			var oParent	= this.parentNode,
				oBefore	= this;
			fAMLQuery_each(vArgument1, function() {
				fAMLElement_insertBefore(oParent, nIndex ? fAMLNode_cloneNode(this, true) : this, oBefore);
			});
			fAMLElement_removeChild(this.parentNode, this);
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

function fAMLQuery_empty(oQuery) {
	// Invoke implementation
	fAMLQuery_each(oQuery, function() {
		while (this.lastChild)
			fAMLElement_removeChild(this, this.lastChild);
	});
	return oQuery;
};

cAMLQuery.prototype.empty	= function() {
	return fAMLQuery_empty(this);
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