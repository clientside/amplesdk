/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXPathException	= function(nCode) {
	this.code	= nCode;
	var sMessage= 'DOM XPath Exception' + ' ' + nCode;
//->Debug
	if (arguments.length > 1)
		sMessage	= arguments[1];
//<-Debug
	this.message	= oXPathException_messages[nCode] + ':' + ' ' + sMessage;
};

cXPathException.prototype	= new cError;

cXPathException.prototype.code		= null;
cXPathException.prototype.message	= null;

// Constants
cXPathException.INVALID_EXPRESSION_ERR	= 51;
cXPathException.TYPE_ERR				= 52;

cXPathException.prototype.toString	= function() {
	return this.message;
};

var oXPathException_messages	= {};
oXPathException_messages[cXPathException.INVALID_EXPRESSION_ERR]	= "INVALID_EXPRESSION_ERR";
oXPathException_messages[cXPathException.TYPE_ERR]					= "TYPE_ERR";


//
ample.publish(cXPathException,	"XPathException");
