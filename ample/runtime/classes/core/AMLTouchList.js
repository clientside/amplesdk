/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cAMLTouchList(){};

//
cAMLTouchList.prototype.length	= 0;

cAMLTouchList.prototype.item		= function(nIndex)
{
	// Validate arguments
	fGuard(arguments, [
		["index",	cNumber]
	]);

	if (nIndex < this.length && nIndex >= 0)
		return this[nIndex];
	else
		throw new cAMLException(cAMLException.INDEX_SIZE_ERR);
};