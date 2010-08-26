/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */


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
			sNameSpaceURI	=(this.resolver || fAmple_resolver)(aQName[0]) || null;
		fAMLQuery_each(this, function() {
			fAMLElement_setAttributeNS(this, sNameSpaceURI, sName, cString(sValue));
		});
		return this;
	}
	else
	if (this.length)
		return fAMLElement_getAttribute(this[0], sName);
};
