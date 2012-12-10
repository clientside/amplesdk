/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
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

	var aQName		= sQName.split(':'),
		sLocalName	= aQName.pop(),
		sPrefix		= aQName.pop() || null,
		sNameSpaceURI	= null;
	if (sPrefix != null)
		sNameSpaceURI	= this.resolver ? this.resolver(sPrefix) : oAmple.prefixes[sPrefix] || null;

	if (arguments.length > 1) {
		return fQuery_each(this, function() {
			if (sValue == null)
				sNameSpaceURI == null ? this.removeAttribute(sQName) : this.removeAttributeNS(sNameSpaceURI, sLocalName);
			else
				sNameSpaceURI == null ? this.setAttribute(sQName, sValue) : this.setAttributeNS(sNameSpaceURI, sQName, sValue);
		});
	}
	else
	if (this.length)
		return sNameSpaceURI == null ? this[0].getAttribute(sQName) : this[0].getAttributeNS(sNameSpaceURI, sLocalName);
	return null;
};
