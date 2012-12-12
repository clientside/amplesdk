/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXPathException	= function(nCode, sMessage) {
	this.code	= nCode;
	this.message= sMessage || oXPathException_messages[nCode];
};

cXPathException.prototype	= new cError;

cXPathException.prototype.code		= null;
cXPathException.prototype.message	= null;

// Constants
cXPathException.INVALID_EXPRESSION_ERR	= 51;
cXPathException.TYPE_ERR				= 52;

var oXPathException_messages	= {};
oXPathException_messages[cXPathException.INVALID_EXPRESSION_ERR]	= "INVALID_EXPRESSION_ERR: DOM XPath Exception 51";
oXPathException_messages[cXPathException.TYPE_ERR]					= "TYPE_ERR: DOM XPath Exception 52";

//
ample.publish(cXPathException,	"XPathException");
