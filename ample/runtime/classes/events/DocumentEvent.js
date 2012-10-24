/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// nsIDOMDocumentEvent
var cDocumentEvent	= function(){};

cDocumentEvent.prototype.createEvent	= function(sName) {
//->Guard
	fGuard(arguments, [
		["eventInterface",	cString]
	]);
//<-Guard

	var fConstructor	= hClasses[sName.replace(/s$/, '')];
	if (fConstructor && (fConstructor == cEvent || fConstructor.prototype instanceof cEvent))
		return new fConstructor;
	else
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};
