/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cNodeList	= function(){};

// nsIDOMNodeList
cNodeList.prototype.length	= 0;

cNodeList.prototype.item	= function(nIndex) {
//->Guard
	fGuard(arguments, [
		["index",	cNumber]
	]);
//<-Guard

	if (nIndex < this.length && nIndex >= 0)
		return this[nIndex];
	else
		throw new cDOMException(cDOMException.INDEX_SIZE_ERR);
};

// Ample methods
cNodeList.prototype.$add	= function(oNode, nPosition) {
	if (arguments.length > 1)
		if (nPosition - 1 < this.length && nPosition >-1)
			for (var nIndex = this.length; nIndex > nPosition - 1; nIndex--)
				this[nIndex]	= this[nIndex - 1];
		else
			throw new cDOMException(cDOMException.INDEX_SIZE_ERR);
	else
		nPosition	= this.length;
	this[nPosition]	= oNode;
	this.length++;

	// Return added object
	return oNode;
};

cNodeList.prototype.$remove	= function(oNode) {
	for (var nIndex = 0, bFound	= false; nIndex < this.length; nIndex++)
		if (bFound)
			this[nIndex - 1]	= this[nIndex];
		else
		if (this[nIndex] == oNode)
			bFound	= true;
	if (bFound)
		delete this[--this.length];
	else
		throw new cDOMException(cDOMException.INDEX_SIZE_ERR);

	// Return removed node
	return oNode;
};

cNodeList.prototype.$indexOf	= function(oNode) {
	for (var nIndex = 0; nIndex < this.length; nIndex++)
		if (oNode == this[nIndex])
			return nIndex;
	return -1;
};
