/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

cQuery.prototype.attr	= function(sQName, sValue) {
//->Guard
	fGuard(arguments, [
		["name",	cString],
		["value",	cObject,	true,	true]
	]);
//<-Guard

	if (arguments.length > 1) {
		var aQName		= sQName.split(':'),
			sLocalName	= aQName.pop(),
			sPrefix		= aQName.pop() || null,
			sNameSpaceURI	= null;
		if (sPrefix != null)
			sNameSpaceURI	= this.resolver ? this.resolver(sPrefix) : oAmple.prefixes[sPrefix] || null;
		fQuery_each(this, function() {
			sValue == null ? fElement_removeAttributeNS(this, sNameSpaceURI, sLocalName) : fElement_setAttributeNS(this, sNameSpaceURI, sQName, cString(sValue));
		});
		return this;
	}
	else
	if (this.length)
		return fElement_getAttribute(this[0], sQName);
	return null;
};
