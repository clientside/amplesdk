/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAmpleException	= function(nCode) {
	this.code	= nCode;

	var sMessage= "AmpleException" + ' ' + nCode;
//->Debug
	// Replace placeholders
	var sValue	= oAmpleException_messages[nCode];
	if (arguments.length > 2)
		sValue	= fAmpleException_format(sValue, arguments[2]);
	sMessage	+= ':' + ' ' + sValue;
//<-Debug

	this.message= sMessage;
	this.caller	= arguments[1] || cAmpleException.caller.caller;
};

// Constants
cAmpleException.ARGUMENT_MISSING_ERR	= 1;
cAmpleException.ARGUMENT_WRONG_TYPE_ERR	= 2;
cAmpleException.ARGUMENT_NULL_ERR		= 3;
cAmpleException.NOT_INITIALIZED_ERR		= 4;
cAmpleException.CANNOT_ACCESS_DOM_ERR	= 5;
cAmpleException.MEMBER_MISSING_ERR		= 6;

//
cAmpleException.prototype		= new cError;
//
cAmpleException.prototype.code		= null;
cAmpleException.prototype.message	= null;
//
cAmpleException.prototype.toString	= function() {
	return this.message;
};

//->Debug
// Ample Exceptions
var oAmpleException_messages	= {};
oAmpleException_messages[cAmpleException.ARGUMENT_MISSING_ERR]		= 'Missing required %0 argument "%1" in "%2" function call';
oAmpleException_messages[cAmpleException.ARGUMENT_WRONG_TYPE_ERR]	= 'Incompatible type of %0 argument "%1" in "%2" function call. Expecting "%3"';
oAmpleException_messages[cAmpleException.ARGUMENT_NULL_ERR]			= 'null is not allowed value of %0 argument "%1" in "%2" function call';
oAmpleException_messages[cAmpleException.NOT_INITIALIZED_ERR]		= 'Object "%0" has not been initialized';
oAmpleException_messages[cAmpleException.CANNOT_ACCESS_DOM_ERR]		= 'Cannot access DOM in element constructor';
oAmpleException_messages[cAmpleException.MEMBER_MISSING_ERR]		= 'Object does not have a method named "%0"';
//<-Debug

//->Debug
function fAmpleException_format(sMessage, aArguments) {
	for (var nIndex = 0; nIndex < aArguments.length; nIndex++)
		sMessage	= sMessage.replace('%' + nIndex, aArguments[nIndex]);
	return sMessage;
};
//<-Debug
