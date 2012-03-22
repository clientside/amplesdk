/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cXPathException(nCode) {
	this.code	= nCode;
};

cXPathException.prototype.code	= null;

// Constants
cXPathException.INVALID_EXPRESSION_ERR	= 51;
cXPathException.TYPE_ERR				= 52;