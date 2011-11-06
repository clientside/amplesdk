/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */


// Text (get/set)
cQuery.prototype.text	= function(sValue) {
//->Guard
	fGuard(arguments, [
		["value",	cObject, true]
	]);
//<-Guard

	if (arguments.length > 0) {
		// Replace children with a text node
		fQuery_each(this, function() {
			while (this.lastChild)
				fElement_removeChild(this, this.lastChild);
			// Add child
			fElement_appendChild(this, fDocument_createTextNode(this.ownerDocument, cString(sValue)));
		});
		return this;
	}
	else {
		// Get inner text
		var aText	= [];
		fQuery_each(this, function(){
			aText.push(fNode_getTextContent(this));
		});
		return aText.join('');
	}
};

cQuery.prototype.html	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["value",	cObject, true]
	]);
//<-Guard

	if (arguments.length > 0) {
		// Empty
		fQuery_empty(this);
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
cQuery.prototype.appendTo	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["target",	cObject]
	]);
//<-Guard

	var oQuery	= new cQuery;
	if (this.length) {
		//
		if (!(vArgument1 instanceof cQuery))
			vArgument1	= fQuery(vArgument1);
		//
		var oSelf	= this;
		fQuery_each(vArgument1, function(nIndex) {
			var oParent	= this;
			oSelf.each(function() {
				var oNode	= nIndex ? fNode_cloneNode(this, true) : this;
				fElement_appendChild(oParent, oNode);
				oQuery[oQuery.length++] = oNode;
			});
		});
	}
	return oQuery;
};

cQuery.prototype.prependTo	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["target",	cObject]
	]);
//<-Guard

	var oQuery	= new cQuery;
	if (this.length) {
		//
		if (!(vArgument1 instanceof cQuery))
			vArgument1	= fQuery(vArgument1);
		//
		var oSelf	= this;
		fQuery_each(vArgument1, function(nIndex) {
			var oParent	= this,
				oBefore	= this.firstChild;
			fQuery_each(oSelf, function() {
				var oNode	= nIndex ? fNode_cloneNode(this, true) : this;
				if (oBefore)
					fElement_insertBefore(oParent, oNode, oBefore);
				else
					fElement_appendChild(oParent, oNode);
				oQuery[oQuery.length++] = oNode;
			});
		});
	}
	return oQuery;
};

cQuery.prototype.insertBefore	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["anchor",	cObject]
	]);
//<-Guard

	var oQuery	= new cQuery;
	if (this.length) {
		//
		if (!(vArgument1 instanceof cQuery))
			vArgument1	= fQuery(vArgument1);
		//
		var oSelf	= this;
		fQuery_each(vArgument1, function(nIndex) {
			var oParent	= this.parentNode,
				oBefore	= this;
			fQuery_each(oSelf, function() {
				var oNode	= nIndex ? fNode_cloneNode(this, true) : this;
				fElement_insertBefore(oParent, oNode, oBefore);
				oQuery[oQuery.length++] = oNode;
			});
		});
	}
	return oQuery;
};

cQuery.prototype.insertAfter	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["anchor",	cObject]
	]);
//<-Guard

	var oQuery	= new cQuery;
	if (this.length) {
		//
		if (!(vArgument1 instanceof cQuery))
			vArgument1	= fQuery(vArgument1);
		//
		var oSelf	= this;
		fQuery_each(vArgument1, function(nIndex) {
			var oParent	= this.parentNode,
				oBefore	= this.nextSibling;
			fQuery_each(oSelf, function() {
				var oNode	= nIndex ? fNode_cloneNode(this, true) : this;
				if (oBefore)
					fElement_insertBefore(oParent, oNode, oBefore == this ? oBefore.nextSibling : oBefore);
				else
					fElement_appendChild(oParent, oNode);
				oQuery[oQuery.length++] = oNode;
			});
		});
	}
	return oQuery;
};

cQuery.prototype.replaceAll	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["source",	cObject]
	]);
//<-Guard

	var oQuery	= new cQuery;
	if (this.length) {
		//
		if (!(vArgument1 instanceof cQuery))
			vArgument1	= fQuery(vArgument1);
		//
		var oSelf	= this;
		fQuery_each(vArgument1, function(nIndex) {
			var oParent	= this.parentNode,
				oBefore	= this;
			fQuery_each(oSelf, function() {
				var oNode	= nIndex ? fNode_cloneNode(this, true) : this;
				fElement_insertBefore(oParent, oNode, oBefore);
				oQuery[oQuery.length++] = oNode;
			});
			fElement_removeChild(this.parentNode, this);
		});
	}
	return oQuery;
};

//
cQuery.prototype.append	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["source",	cObject]
	]);
//<-Guard

	if (this.length) {
		//
		if (!(vArgument1 instanceof cQuery))
			vArgument1	= fQuery(vArgument1);
		//
		fQuery_each(this, function(nIndex) {
			var oParent	= this;
			fQuery_each(vArgument1, function() {
				var oNode	= nIndex ? fNode_cloneNode(this, true) : this;
				fElement_appendChild(oParent, oNode);
			});
		});
	}
	return this;
};

cQuery.prototype.prepend	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["source",	cObject]
	]);
//<-Guard

	if (this.length) {
		//
		if (!(vArgument1 instanceof cQuery))
			vArgument1	= fQuery(vArgument1);
		//
		fQuery_each(this, function(nIndex) {
			var oParent	= this,
				oBefore	= this.firstChild;
			fQuery_each(vArgument1, function() {
				var oNode	= nIndex ? fNode_cloneNode(this, true) : this;
				if (oBefore)
					fElement_insertBefore(oParent, oNode, oBefore);
				else
					fElement_appendChild(oParent, oNode);
			});
		});
	}
	return this;
};

cQuery.prototype.before	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["source",	cObject]
	]);
//<-Guard

	if (this.length) {
		//
		if (!(vArgument1 instanceof cQuery))
			vArgument1	= fQuery(vArgument1);
		//
		fQuery_each(this, function(nIndex) {
			var oParent	= this.parentNode,
				oBefore	= this;
			fQuery_each(vArgument1, function() {
				var oNode	= nIndex ? fNode_cloneNode(this, true) : this;
				if (oParent)
					fElement_insertBefore(oParent, oNode, oBefore);
				else {
					// TODO: insert into self collection before
				}
			});
		});
	}
	return this;
};

cQuery.prototype.after	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["source",	cObject]
	]);
//<-Guard

	if (this.length) {
		//
		if (!(vArgument1 instanceof cQuery))
			vArgument1	= fQuery(vArgument1);
		//
		fQuery_each(this, function(nIndex) {
			var oParent	= this.parentNode,
				oBefore	= this.nextSibling;
			fQuery_each(vArgument1, function() {
				var oNode	= nIndex ? fNode_cloneNode(this, true) : this;
				if (oParent) {
					if (oBefore)
						fElement_insertBefore(oParent, oNode, oBefore == this ? oBefore.nextSibling : oBefore);
					else
						fElement_appendChild(oParent, oNode);
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
cQuery.prototype.replaceWith	= function(vArgument1) {
//->Guard
	fGuard(arguments, [
		["source",	cObject]
	]);
//<-Guard

	if (this.length) {
		//
		if (!(vArgument1 instanceof cQuery))
			vArgument1	= fQuery(vArgument1);
		//
		fQuery_each(this, function(nIndex) {
			var oParent	= this.parentNode,
				oBefore	= this;
			fQuery_each(vArgument1, function() {
				fElement_insertBefore(oParent, nIndex ? fNode_cloneNode(this, true) : this, oBefore);
			});
			fElement_removeChild(this.parentNode, this);
		});
	}
	return this;
};

//
cQuery.prototype.remove	= function() {
	// Invoke implementation
	fQuery_each(this, function() {
		fElement_removeChild(this.parentNode, this);
	});
	return this;
};

function fQuery_empty(oQuery) {
	// Invoke implementation
	fQuery_each(oQuery, function() {
		while (this.lastChild)
			fElement_removeChild(this, this.lastChild);
	});
	return oQuery;
};

cQuery.prototype.empty	= function() {
	return fQuery_empty(this);
};

//
cQuery.prototype.clone	= function() {
	// Invoke implementation
	var oQuery	= new cQuery;
	fQuery_each(this, function() {
		oQuery[oQuery.length++]	= fNode_cloneNode(this, true);
	});
	return oQuery;
};