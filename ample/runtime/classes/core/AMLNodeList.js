/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLNodeList	= function(){};

// nsIDOMNodeList
cAMLNodeList.prototype.length	= 0;

cAMLNodeList.prototype.item		= function(nIndex)
{
	// Validate arguments
	fAML_validate(arguments, [
		["index",	cNumber]
	], "item");

	if (nIndex < this.length && nIndex >= 0)
		return this[nIndex];
	else
		throw new cAMLException(cAMLException.INDEX_SIZE_ERR);
};

// Ample methods
cAMLNodeList.prototype.$add		= function(oNode, nPosition)
{
	if (arguments.length > 1)
		if (!fIsNaN(nPosition) && nPosition - 1 < this.length && nPosition >-1)
			for (var nIndex = this.length; nIndex > nPosition - 1; nIndex--)
				this[nIndex]	= this[nIndex - 1];
		else
			throw new cAMLException(cAMLException.INDEX_SIZE_ERR);
	else
		nPosition	= this.length;
	this[nPosition]	= oNode;
	this.length++;

	// Return added object
    return oNode;
};

cAMLNodeList.prototype.$remove		= function(oNode)
{
	for (var nIndex = 0, bFound	= false; nIndex < this.length; nIndex++)
		if (bFound)
			this[nIndex - 1]	= this[nIndex];
		else
		if (this[nIndex] == oNode)
			bFound	= true;
	if (bFound)
		delete this[--this.length];
	else
		throw new cAMLException(cAMLException.INDEX_SIZE_ERR);

	// Return removed node
	return oNode;
};

cAMLNodeList.prototype.$indexOf	= function(oNode)
{
    for (var nIndex = 0; nIndex < this.length; nIndex++)
        if (oNode == this[nIndex])
            return nIndex;
    return -1;
};
