/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cDOMError	= function(sMessage, nSeverity, oException) {
	this.message	= sMessage;
	this.severity	= nSeverity;
	this.relatedException	= oException;
};

cDOMError.SEVERITY_WARNING		= 1;
cDOMError.SEVERITY_ERROR		= 2;
cDOMError.SEVERITY_FATAL_ERROR	= 3;

cDOMError.prototype.severity	= null;
cDOMError.prototype.message		= null;
cDOMError.prototype.type		= null;
cDOMError.prototype.relatedException	= null;
cDOMError.prototype.relatedData	= null;
cDOMError.prototype.location	= null;
