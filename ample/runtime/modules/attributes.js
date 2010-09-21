/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */


cAMLQuery.prototype.attr	= function(sQName, sValue) {
	// Validate API call
	fGuard(arguments, [
		["name",	cString],
		["value",	cObject,	true,	true]
	]);

	// Invoke implementation
	if (arguments.length > 1) {
		var aQName		= sQName.split(':'),
			sLocalName	= aQName.pop(),
			sPrefix		= aQName.pop() || null,
			sNameSpaceURI	= null;
		if (sPrefix != null)
			sNameSpaceURI	=(this.resolver || fAmple_resolver)(sPrefix) || null;
		fAMLQuery_each(this, function() {
			sValue == null ? fAMLElement_removeAttributeNS(this, sNameSpaceURI, sLocalName) : fAMLElement_setAttributeNS(this, sNameSpaceURI, sQName, cString(sValue));
		});
		return this;
	}
	else
	if (this.length)
		return fAMLElement_getAttribute(this[0], sQName);
	return null;
};
