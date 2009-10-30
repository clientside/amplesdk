/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLError	= function(sMessage, nSeverity, oException) {
	this.message	= sMessage;
	this.severity	= nSeverity;
	this.relatedException	= oException;
};

cAMLError.SEVERITY_WARNING		= 1;
cAMLError.SEVERITY_ERROR 		= 2;
cAMLError.SEVERITY_FATAL_ERROR	= 3;

cAMLError.prototype.severity	= null;
cAMLError.prototype.message		= null;
cAMLError.prototype.type		= null;
cAMLError.prototype.relatedException	= null;
cAMLError.prototype.relatedData	= null;
cAMLError.prototype.location	= null;
